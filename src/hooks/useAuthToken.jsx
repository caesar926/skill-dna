import { useState, useEffect } from "react";

export function useAuthToken(apiBase) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${apiBase}/auth/me`, {
          credentials: 'include'
        })
        const data = await res.json()
        setIsLoggedIn(data.loggedIn)
        setUsername(data.username ?? null)
      } catch {
        setIsLoggedIn(false)
        setUsername(null)
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [apiBase])

  return [isLoggedIn, setIsLoggedIn, username, checkingAuth]
}
