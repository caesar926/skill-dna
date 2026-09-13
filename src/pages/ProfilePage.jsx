import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'
import DevProfile from '../components/DevProfile'

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
 <DevProfile profile={{
  avatar_url: profile.data?.avatarUrl,
  login: profile.github_username,
  bio: profile.data?.bio,
  public_repos: profile.data?.repositories?.totalCount ?? 0,
  followers: profile.data?.followers?.totalCount ?? 0,
}} />
)
  )
 
}

export default ProfilePage