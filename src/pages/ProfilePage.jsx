import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'
import DevProfile from '../components/DevProfile'
import Heatmap from '../components/Heatmap'
import RepoCard from '../components/RepoCard'
import { calculateScore } from '../utils/proofOfWorkScore'
import { useSuggestions } from '../hooks/useSuggestions'


export function ProfilePage({ apiBase}) {
  const { username } = useParams()
  const { status, errorMessage, profile } = usePersonalProfile(username, apiBase)
  const { suggestions, loading, fetchSuggestions } = useSuggestions(username, apiBase)
  const [copied, setCopied] = useState(false)

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


    function handleShare()  {
        try{
        const link = window.location.href  
        
        const clip = async () => {
          await navigator.clipboard.writeText(link)
            setCopied(true)
          const timer = setTimeout(()=> {
            setCopied(false)
          }, 2000)
        }
        clip()
        }catch (error){
          error.message
          console.log(error.message)
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
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
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
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
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
                <div className="suggestion-box">
                  <p className="suggestion-text">{suggestions.impactScore}</p>
                </div>
              )}
            </div>

            <div className="score-card">
              <span className="score-label">Activity Score</span>
              <span className="score-value">{Math.round(activityScore)}</span>
              {suggestions?.activityScore && (
                <div className="suggestion-box">
                  <p className="suggestion-text">{suggestions.activityScore}</p>
                </div>
              )}
            </div>

            <div className="score-card">
              <span className="score-label">Breadth score</span>
              <span className="score-value">{Math.round(breadthScore)}</span>
              {suggestions?.breadthScore && (
                <div className="suggestion-box">
                  <p className="suggestion-text">{suggestions.breadthScore}</p>
                </div>
              )}
            </div>

            <div className="score-card">
              <span className="score-label">Open source score</span>
              <span className="score-value">{Math.round(openSourceScore)}</span>
              {suggestions?.openSourceScore && (
                <div className="suggestion-box">
                  <p className="suggestion-text">{suggestions.openSourceScore}</p>
                </div>
              )}
            </div>

            <div className="score-card">
              <span className="score-label">Project Quality score</span>
              <span className="score-value">{Math.round(projectQualityScore)}</span>
              {suggestions?.projectQualityScore && (
                <div className="suggestion-box">
                  <p className="suggestion-text">{suggestions.projectQualityScore}</p>
                </div>
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