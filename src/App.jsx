import { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import {HomePage} from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { SearchBar } from './components/SearchBar';
import { tallyLanguages } from './utils/LanguageState';
import { UseGitprofileData } from './hooks/UseGitprofileData';
import './App.css';

function App() {
  const API_BASE = 'https://skill-dna-2sqj.onrender.com';
  const [searchedUser, setSearchedUser] = useState('');

  const {
    isLoggedIn,
    profileData,
    repos,
    pinnedRepos,
    loading,
    error,
    contributionData,
    activityMetrics,
  } = UseGitprofileData(searchedUser, API_BASE);

  const languageCounts = tallyLanguages(repos);
  const total = Object.values(languageCounts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="App">
         
  <SearchBar
          onSearch={setSearchedUser}
          authToken={isLoggedIn}
          apiBase={API_BASE}
        />
  <Routes>
    <Route path="/" element={<HomePage loading={loading} error={error} profileData={profileData} activityMetrics={activityMetrics} total={total} languageCounts={languageCounts} pinnedRepos={pinnedRepos} repos={repos} contributionData={contributionData} />} />
    <Route path="/u/:username" element={<ProfilePage apiBase={API_BASE} />} />
  </Routes>


     
    </div>
  );
}

export default App;