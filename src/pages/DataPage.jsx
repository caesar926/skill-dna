import { Link, Navigate } from 'react-router-dom';
import { DevProfile } from '../components/DevProfile';
import { Analytics } from '../components/Analytics';
import { RepoCard } from '../components/RepoCard';
import { Heatmap } from '../components/Heatmap';
import { useAnalysisMessages } from '../hooks/useLoading';

export function DataPage({
  searchedUser,
  onSearch,
  loading,
  error,
  profileData,
  activityMetrics,
  total,
  languageCounts,
  pinnedRepos,
  contributionData,
}) {
  const analysisMessage = useAnalysisMessages(loading);

  if (!searchedUser && !loading && !error && !profileData) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {loading && (
        <div className="analyzing-state">
          <div className="analyzing-spinner" />
          <p className="analyzing-text">{analysisMessage}</p>
        </div>
      )}

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
              <div>
                <h2>Proof-of-Work</h2>
                <p>Data parsed from an authenticated user profile.</p>
              </div>

              <Link to={`/u/${searchedUser}`} className="view-profile-btn">
                View Full Profile
              </Link>
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
                  <RepoCard
                    key={repo.id}
                    repo={{
                      html_url: repo.url,
                      name: repo.name,
                      description: repo.description,
                      language: repo.primaryLanguage?.name,
                      stargazers_count: repo.stargazerCount,
                      forks_count: repo.forkCount,
                    }}
                  />
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

export default DataPage;
