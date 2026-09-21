import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { SearchBar } from './components/SearchBar';
import { UseGitprofileData } from './hooks/UseGitprofileData.jsx';
import './App.css';


function App() {
  const API_BASE = 'https://skill-dna-2sqj.onrender.com';

  const [searchedUser, setSearchedUser] = useState('');

  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const showSearchBar = !isHomePage || Boolean(searchedUser) 

  const [searchTrigger, setSearchTrigger] = useState(0);
  const {
    isLoggedIn,
    profileData,
    pinnedRepos,
    loading,
    error,
    contributionData,
    activityMetrics,
    languageCounts
  } = UseGitprofileData(searchedUser, API_BASE, searchTrigger);

  
 

const handleSearch = (name) => {
  setSearchedUser(name);
  setSearchTrigger((t) => t + 1);
};

  return (
    <div className="App">

      {showSearchBar && (
        <SearchBar
          onSearch={handleSearch}
          authToken={isLoggedIn}
          apiBase={API_BASE}
        />
      )}

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              onSearch={handleSearch}
              searchedUser={searchedUser}
              loading={loading}
              error={error}
              profileData={profileData}
              activityMetrics={activityMetrics}
              languageCounts={languageCounts} 
              total={Object.values(languageCounts).reduce((s, n) => s + n, 0)}
              pinnedRepos={pinnedRepos}
              contributionData={contributionData}
              isLoggedIn={isLoggedIn}
              apiBase={API_BASE}
            />
          }
        />

        <Route
          path="/u/:username"
          element={
            <ProfilePage
              apiBase={API_BASE}
            />
          }
        />

      </Routes>

    </div>
  );
}

export default App;