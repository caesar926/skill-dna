import { DevProfile } from '../components/DevProfile';
import { Analytics } from '../components/Analytics';
import { RepoCard } from '../components/RepoCard';
import { Heatmap } from '../components/Heatmap';
import { Skeleton } from '../components/Skeleton';

export function HomePage({ loading, error, profileData, activityMetrics, total, languageCounts, pinnedRepos,  contributionData }) {
  return (
    <>
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
  )
}