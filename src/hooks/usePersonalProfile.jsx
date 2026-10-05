import { useState } from "react"
import { useEffect } from "react"

export function usePersonalProfile(username, apiBase, isOwnProfile) {
  const [status, setStatus] = useState("loading")
  const [errorMessage, setErrorMessage] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let ignore = false

    const profileData = async () => {
      setStatus("loading")

      const url = isOwnProfile
        ? `${apiBase}/api/profile/claim`
        : `${apiBase}/api/profile/${username}`

      const options = { credentials: 'include' }

      try {
        const response = await fetch(url, options)
        if (ignore) return

        if (response.status === 404) {
          setStatus("notFound")
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          if (ignore) return
          setErrorMessage(errorData?.error || "Something went wrong loading this profile.")
          setStatus("error")
          return
        }

        const data = await response.json()
        if (ignore) return

        setProfile(data)
        setStatus("success")
      } catch {
        if (ignore) return
        setErrorMessage("Something went wrong loading this profile.")
        setStatus("error")
      }
    }

    profileData()

    return () => {
      ignore = true
    }
  }, [username, apiBase, isOwnProfile])

  return {
    status,
    errorMessage,
    profile,
  }
}
