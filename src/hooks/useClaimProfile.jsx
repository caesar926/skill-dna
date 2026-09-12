import { useState } from "react";

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
        setErrorMessage(errorData.error || "Failed to claim profie")
        setClaimStatus("error")
        return
      }
      const data = await response.json()
      setClaimedProfile(data)
      setClaimStatus("success")
    } catch {
      setErrorMessage("Unable to connect to the server. please check your internet connection and try again");
      setClaimStatus("error")
    }

  }



  return {
    claimStatus,
    claimedProfile,
    errorMessage,
    claimProfile
  }
}

