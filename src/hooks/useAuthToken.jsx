import { useState, useEffect } from "react";

export function useAuthToken(apiBase) {
  const [isLoggedIn, setIsLoggedIn] = useState(apiBase);

  useEffect(() => {
    const checkAuth = async () => {
      try{
         const res = await fetch (`${apiBase}/auth/me`,
        {
          credentials:'include'
        })
       const data = await res.json()
       setIsLoggedIn(data.loggedIn)
      } catch{
        setIsLoggedIn(false)
      }
     
      } 
        checkAuth()
    }, [])
    return [isLoggedIn, setIsLoggedIn]
  }
 