import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { DevProfile } from './components/DevProfile';
import { Analytics } from './components/Analytics';
import { RepoCard } from './components/RepoCard';
import { Heatmap } from './components/Heatmap';
import { Skeleton } from './components/Skeleton';
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

      {loading && <Skeleton />}

      {error && !loading && <p className="status-msg error-msg">Error: {error}</p>}

      {profileData && !loading && (
        <main className="dashboard-container">
          <aside className="left-sidebar">
            <DevProfile profile={profileData} />
          </aside>

          <section className="main-content">
            <header className="content-headline">
              <h2>Proof-of-Work</h2>
              <p>Data parsed from an authenticated user profile.</p>
            </header>

            <div className="metrics-row">
              <div className="metric-card">
                <h4>Total Stars</h4>
                <p>{activityMetrics.totalStars}</p>
              </div>
              <div className="metric-card">
                <h4>Commits This Year</h4>
                <p>{activityMetrics.totalCommits}</p>
              </div>
              <div className="metric-card">
                <h4>Pull Requests</h4>
                <p>{activityMetrics.totalPRs}</p>
              </div>
            </div>

            {total > 0 ? (
              <Analytics languageCounts={languageCounts} total={total} />
            ) : (
              <div className="empty-state-card">
                <p>No public language statistics detected for this account.</p>
              </div>
            )}

            <h3 className="section-title">
              {pinnedRepos.length > 0 ? 'Pinned Repositories' : 'Repositories'}
            </h3>

            {repos.length === 0 ? (
              <div className="empty-state-card">
                <p>This user has no public repositories available.</p>
              </div>
            ) : (
              <div className="repo-grid">
                {(pinnedRepos.length > 0 ? pinnedRepos : repos).map((repo) => (
                  <RepoCard key={repo.id || repo.name} repo={repo} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      <Heatmap contributionData={contributionData} />
    </div>
  );
}

export default App;