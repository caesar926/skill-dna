import { useState } from 'react';
import { DevProfile } from '../components/DevProfile';
import { Analytics } from '../components/Analytics';
import { RepoCard } from '../components/RepoCard';
import { Heatmap } from '../components/Heatmap';
import { Skeleton } from '../components/Skeleton';
import { AuthControl } from '../components/AuthControl';
export function HomePage({ onSearch, searchedUser, loading, error, profileData, activityMetrics, total, languageCounts, pinnedRepos, contributionData, apiBase, isLoggedIn }) {
  const [userName, setUserName] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(userName);
    }
  };

  return (
    <>
      {!searchedUser && (
        <>
          <div className="hero-auth-fixed">
            <AuthControl apiBase={apiBase} authToken={isLoggedIn} />
          </div>

          <section className="homepage-hero">
            <div className="hero-card">

              <div className="hero-content">
                <h1 className="hero-title">Developer Search</h1>
                <p className="hero-subtitle">Search and verify developer proof-of-work scores</p>

                <div className="page-search-container">
                  <img className="search-icon-inline" src="icons/search.svg" alt="" />
                  <input
                    className="page-search-input"
                    type="text"
                    placeholder="Search developer username..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="page-search-btn"
                    onClick={() => onSearch(userName)}
                    type="button"
                    aria-label="Search"
                  >
                    <img src="icons/search.svg" alt="Search" />
                  </button>
                </div>

                
              </div>


                <div className="quick-users-viewport">
  <div className="quick-users-row">
    {[...Array(2)].flatMap((_, dup) =>
      ['caesar926', 'torvalds', 'gaearon', 'sindresorhus', 'addyosmani', 'tj'].map((name) => (
        <button
          key={`${name}-${dup}`}
          type="button"
          className="quick-user-card"
          onClick={() => onSearch(name)}
        >
          <img
            src={`https://github.com/${name}.png`}
            alt={name}
            className="quick-user-avatar"
          />
          <span className="quick-user-name">{name}</span>
        </button>
      ))
    )}
  </div>
</div>
            </div>
          </section>
        </>


      )}

      {loading && <Skeleton />}

      {error && !loading && (
  <div className="error-state-card">
    <div className="error-icon">!</div>
    <h3>Couldn't find that developer</h3>
    <p>{error}</p>
    <button className="error-retry-btn" onClick={() => onSearch(searchedUser)}>
      Try again
    </button>
  </div>
)}

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

            {pinnedRepos.length === 0 ? (
              <div className="empty-state-card">
                <p>This user has no pinned repositories available.</p>
              </div>
            ) : (
              <div className="repo-grid">
                {pinnedRepos.map((repo) => (
                  <RepoCard key={repo.id || repo.name} repo={repo} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      <Heatmap contributionData={contributionData} />
    </>
  );
}