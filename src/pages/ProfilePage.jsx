import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'
import DevProfile from '../components/DevProfile'
import Heatmap from '../components/Heatmap'
import RepoCard from '../components/RepoCard'
import { calculateScore } from '../utils/proofOfWorkScore'
import { useSuggestions } from '../hooks/useSuggestions'
import { useAuthToken } from '../hooks/useAuthToken'
import { generateShareCard } from '../utils/shareCard'

export function ProfilePage({ apiBase }) {
  const { username } = useParams()

  const [isLoggedIn, , viewerUsername, checkingAuth] = useAuthToken(apiBase)
  const isOwnProfile = viewerUsername === username
  const { status, errorMessage, profile } = usePersonalProfile(username, apiBase, isOwnProfile)
  const { suggestions, loading, fetchSuggestions } = useSuggestions(username, apiBase)
  const [copied, setCopied] = useState(false)
  const [generatingCard, setGeneratingCard] = useState(false)
  const cardRef = useRef(null)

  if (checkingAuth) {
    return <Skeleton />
  }

  if (!isLoggedIn) {
    return (
      <div className="login-required-card">
        <h3>Login required</h3>
        <p>You need to log in with GitHub to view developer profiles.</p>
        <a href={`${apiBase}/auth/login`} className="github-login-btn">
          Login with GitHub
        </a>
      </div>
    );
  }

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

  function handleShare() {
    try {
      const link = window.location.href

      const clip = async () => {
        await navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      }
      clip()
    } catch (error) {
      console.log(error.message)
    }
  }

  async function handleDownloadCard() {
    if (!cardRef.current) return
    setGeneratingCard(true)
    try {
      const blob = await generateShareCard(cardRef.current)
      const file = new File([blob], `skill-dna-${profile.github_username}.png`, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Skill DNA score',
          text: `Check out my Proof-of-Work score on Skill DNA`,
        })
      } else {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `skill-dna-${profile.github_username}.png`
        link.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setGeneratingCard(false)
    }
  }

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
          {/* AI Banner / Button Section */}

          <div className='ai-share-container'>
            <div className='ai-suggestion-bar'>
              <div className="ai-status">
                <span className="ai-badge">
                  <svg className="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  AI Insights
                </span>

                {loading === "error" && <span className="ai-error-tag">Error fetching suggestions</span>}
              </div>

              <button
                className={`ai-btn ${loading === "loading" ? "is-loading" : ""} ${loading === "success" ? "is-success" : ""}`}
                onClick={fetchSuggestions}
                disabled={loading === "loading"}
              >
                {loading === "idle" && (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                    <span>Generate AI Insights</span>
                  </>
                )}
                {loading === "loading" && (
                  <>
                    <span className="spinner"></span>
                    <span>Analyzing Profile...</span>
                  </>
                )}
                {loading === "success" && (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>Regenerate Insights</span>
                  </>
                )}
                {loading === "error" && (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>Retry AI Insights</span>
                  </>
                )}
              </button>
            </div>

            <button className={`share-btn ${copied ? 'copied' : ''}`} onClick={handleShare}>
              {copied ? 'Copied!' : 'Share profile'}
            </button>

            <button
              className="share-btn"
              onClick={handleDownloadCard}
              disabled={generatingCard}
            >
              {generatingCard ? 'Generating...' : 'Download score card'}
            </button>
          </div>

          <section className="player-scorecard" aria-label="Proof of work scorecard" ref={cardRef}>
            <div className="player-scorecard-topline">
              <span>SKILLDNA / PROOF OF WORK</span><span>DEVELOPER CARD</span>
            </div>
            <div className="player-scorecard-identity">
              <div className="player-scorecard-overall">
                <span className="player-scorecard-number">{Math.round(finalScore)}</span>
                <span className="player-scorecard-caption">FINAL SCORE</span>
              </div>
              <div className="player-scorecard-person">
                {profile.data?.avatarUrl && <img src={profile.data.avatarUrl} alt="" className="player-scorecard-avatar" />}
                <div className="player-scorecard-handle">@{profile.github_username}</div>
                <div className="player-scorecard-role">GITHUB DEVELOPER</div>
              </div>
            </div>
            <div className="player-scorecard-stats">
              {[
                { label: 'Impact', value: impactScore, note: suggestions?.impactScore },
                { label: 'Activity', value: activityScore, note: suggestions?.activityScore },
                { label: 'Breadth', value: breadthScore, note: suggestions?.breadthScore },
                { label: 'Open source', value: openSourceScore, note: suggestions?.openSourceScore },
                { label: 'Project quality', value: projectQualityScore, note: suggestions?.projectQualityScore },
              ].map(({ label, value, note }) => (
                <div className="player-scorecard-stat" key={label}>
                  <div className="player-scorecard-statline"><strong>{Math.round(value)}</strong><span>{label}</span></div>
                  {note && <p className="player-scorecard-note">{note}</p>}
                </div>
              ))}
            </div>
          </section>

          {(profile.data?.pinnedItems?.nodes ?? []).map((repo) => (
            <div className="repo-grid">
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
            </div>
       
          ))}
        </section>
      </main>

      <Heatmap contributionData={profile.data?.contributionsCollection?.contributionCalendar} />
    </>
  )
}

export default ProfilePage
