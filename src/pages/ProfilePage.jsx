import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'
import DevProfile from '../components/DevProfile'
import Heatmap from '../components/Heatmap'
import RepoCard from '../components/RepoCard'

export function ProfilePage({apiBase}) {
  const { username } = useParams()
  const { status, errorMessage, profile } = usePersonalProfile(username, apiBase)
  
  return(
  status === "loading" ? (
  <Skeleton />
) : status === "notFound" ? (
  <p>This developer hasn't claimed their profile yet</p>
) : status === "error" ? (
  <p>{errorMessage}</p>
) : (
  <>
     <DevProfile profile={{
  avatar_url: profile.data?.avatarUrl,
  login: profile.github_username,
  bio: profile.data?.bio,
  public_repos: profile.data?.repositories?.totalCount ?? 0,
  followers: profile.data?.followers?.totalCount ?? 0,
}} />
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

  <Heatmap contributionData={profile.data?.contributionsCollection?.contributionCalendar} />
  </>

)
  )
 
}

export default ProfilePage