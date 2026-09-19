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

  const showSearchBar = !isHomePage || Boolean(searchedUser) || profileData;

  const {
    isLoggedIn,
    profileData,
    pinnedRepos,
    loading,
    error,
    contributionData,
    activityMetrics,
    languageCounts
  } = UseGitprofileData(searchedUser, API_BASE);

  
 

  return (
    <div className="App">

      {showSearchBar && (
        <SearchBar
          onSearch={setSearchedUser}
          authToken={isLoggedIn}
          apiBase={API_BASE}
        />
      )}

      <Routes>

        <Route
          path="/"
          element={
            <HomePage
              onSearch={setSearchedUser}
              searchedUser={searchedUser}
              loading={loading}
              error={error}
              profileData={profileData}
              activityMetrics={activityMetrics}
              languageCounts={languageCounts} 
              total={Object.values(languageCounts).reduce((s, n) => s + n, 0)}
              pinnedRepos={pinnedRepos}
             
              contributionData={contributionData}
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