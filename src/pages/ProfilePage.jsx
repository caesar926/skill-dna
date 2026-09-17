import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'
import DevProfile from '../components/DevProfile'
import Heatmap from '../components/Heatmap'
import RepoCard from '../components/RepoCard'
import { calculateScore } from '../utils/proofOfWorkScore'
import { useSuggestions } from '../hooks/useSuggestions'


export function ProfilePage({ apiBase }) {
  const { username } = useParams()
  const { status, errorMessage, profile } = usePersonalProfile(username, apiBase)
  const { suggestions, loading, error, fetchSuggestions } = useSuggestions(username, apiBase)

  if (status === "loading") {
    return <Skeleton />
  }

  if (status === "notFound") {
    return <p>This developer hasn't claimed their profile yet</p>
  }

  if (status === "error") {
    return <p>{errorMessage}</p>
  }

  const { finalScore, activityScore, impactScore, breadthScore, projectQualityScore,
    openSourceScore } = calculateScore(profile);

  return (
    <>
      <main className='dashboard-container'>
        <aside className='left-sidebar'>
          <DevProfile profile={{
            avatar_url: profile.data?.avatarUrl,
            login: profile.github_username,
            bio: profile.data?.bio,
            public_repos: profile.data?.repositories?.totalCount ?? 0,
            followers: profile.data?.followers?.totalCount ?? 0,
          }} />
        </aside>

        <section className='main-content'>
          <div className='aiSuggestion'>
            {
              loading === "idle" ? (
                <button onClick={fetchSuggestions}>AI suggestion</button>
              ) : loading === "loading" ? (
                <button disabled>Loading...</button>
              ) : loading === "success" ? (
                <span>Suggestions fetched</span>
              ) : (
                <div>
                  error {error}
                  <button onClick={fetchSuggestions}>AI suggestion</button>
                </div>
              )
            }
          </div>

          <div className="scores-grid">
            <div className="score-card highlight">
              <span className="score-label">Final Score</span>
              <span className="score-value">{Math.round(finalScore)}</span>
            </div>
            <div className="score-card">
              <span className="score-label">Impact Score</span>
              <span className="score-value">{Math.round(impactScore)}</span>
              {suggestions?.impactScore && (
                <p className="suggestion-text">{suggestions.impactScore}</p>
              )}
            </div>
            <div className="score-card">
              <span className="score-label">Activity Score</span>
              <span className="score-value">{Math.round(activityScore)}</span>
              {suggestions?.activityScore && (
                <p className="suggestion-text">{suggestions.activityScore}</p>
              )}
            </div>
            <div className="score-card">
              <span className="score-label">Breadth score</span>
              <span className="score-value">{Math.round(breadthScore)}</span>
              {suggestions?.breadthScore && (
                <p className="suggestion-text">{suggestions.breadthScore}</p>
              )}
            </div>
            <div className="score-card">
              <span className="score-label">Open source score</span>
              <span className="score-value">{Math.round(openSourceScore)}</span>
              {suggestions?.openSourceScore && (
                <p className="suggestion-text">{suggestions.openSourceScore}</p>
              )}
            </div>
            <div className="score-card">
              <span className="score-label">Project Quality score</span>
              <span className="score-value">{Math.round(projectQualityScore)}</span>
              {suggestions?.projectQualityScore && (
                <p className="suggestion-text">{suggestions.projectQualityScore}</p>
              )}
            </div>
          </div>

          {(profile.data?.pinnedItems?.nodes ?? []).map((repo) => (
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
        </section>
      </main>

      <Heatmap contributionData={profile.data?.contributionsCollection?.contributionCalendar} />

    </>
  )
}

export default ProfilePage