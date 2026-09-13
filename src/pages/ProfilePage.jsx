import { useParams } from 'react-router-dom'
import { usePersonalProfile } from '../hooks/usePersonalProfile'
import { Skeleton } from '../components/Skeleton'

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
  <pre>{JSON.stringify(profile, null, 2)}</pre>
)
  )
 
}

export default ProfilePage