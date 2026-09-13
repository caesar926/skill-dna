import { useState } from "react"
import { useEffect } from "react"

export function usePersonalProfile(username, apiBase){
  const [status, setStatus] = useState("loading")
  const [errorMessage, setErrorMessage] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
     const profileData = async () => {
      setStatus("loading")
    const response = await fetch (`${apiBase}/api/profile/${username}`)

     if (response.status === 404) {
      setStatus("notFound")
      return
    } else if(!response.ok) {
      const errorData = await response.json()
      setErrorMessage(errorData)
      setStatus("error")
      return
    }else{
      
    const data = await response.json()
    setProfile(data)
    setStatus("success")
    }
    }
    profileData()
  }, [username, apiBase])
 
    return{
      status,
      errorMessage,
      profile,
    
    }
}