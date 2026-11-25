import { useEffect, useState } from "react";

export function useClaimedProfile(username, apiBase) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    let ignore = false

    async function checkProfileClaimed() {
      try {
        const response = await fetch(
          `${apiBase}/api/public/claimed/${encodeURIComponent(username)}`
        )
        if (!response.ok) {
          const data = await response.json()
          if (ignore) return
          setResult({
            forUsername: username,
            claimed:null,
            error: data.error || "Failed to load user data"
          })
          return
        }

        const data = await response.json()
        if (ignore) return
        console.log(data)
        console.log(data.claimed)
        setResult({
          forUsername: username,
          claimed: data.claimed,
          error:null
        })
      } catch (err) {
        if (ignore) return
        setResult({
          forUsername: username,
          claimed: null,
          error: err.message ||'Failed to check profile status',
        })
      }
    }
    checkProfileClaimed()
    return () => {
      ignore = true
    }

  }, [username, apiBase])
  const claimedLoading = result === null || result.forUsername !== username
  return {
    claimedLoading,
    claimed: claimedLoading ? null : result.claimed,
    claimedError: claimedLoading ? null : result.error,
  }
}