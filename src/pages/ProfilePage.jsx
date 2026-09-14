import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'
import DevProfile from '../components/DevProfile'
import Heatmap from '../components/Heatmap'
import RepoCard from '../components/RepoCard'
import {calculateScore} from '../utils/proofOfWorkScore'

export function ProfilePage({ apiBase}) {
  const { username } = useParams()
  const { status, errorMessage, profile } = usePersonalProfile(username, apiBase)

  if (status === "loading"){
    return <Skeleton/>
  }

  if(status === "notFound"){
    return <p>This developer hasn't claimed their profile yet</p>
  }

  if (status === "error") {
    return <p>{errorMessage}</p>
  }

  const { finalScore, activityScore, impactScore } = calculateScore(profile);

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
      
         <p>{Math.round( impactScore)}</p>
         <p>{Math.round( activityScore)}</p>
         <p>{Math.round( finalScore)}</p>
        
          {( profile.data?.pinnedItems?.nodes ?? []).map((repo) => (
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