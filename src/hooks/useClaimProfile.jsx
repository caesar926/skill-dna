import { useEffect, useState } from "react";

export function useClaimProfile(apiBase) {
  const [claimStatus, setClaimStatus] = useState("idle")
  const [claimedProfile, setClaimedProfile] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const claimProfile = async () => {
    setClaimStatus('loading');
    try {
      const response = await fetch(`${apiBase}/api/profile/claim`, {
        credentials: 'include'
      })
      if (!response.ok) {
        const errorData = await response.json()
        setErrorMessage(errorData.error || "Failed to claim profile")
        setClaimStatus("error")
        return
      }
      const data = await response.json()
      setClaimedProfile(data)
      setClaimStatus("success")
    } catch {
      setErrorMessage("Check your internet connection and try again");
      setClaimStatus("error")
    }
  };

  useEffect(() => {
    claimProfile()
  }, [apiBase])

  return {
    claimStatus,
    claimedProfile,
    errorMessage,
    claimProfile,
  }
}