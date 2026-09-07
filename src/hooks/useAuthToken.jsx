import { useState, useEffect } from "react";

export function useAuthToken () {
const [authToken, setAuthToken] = useState(null);
   useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#token=')) {
      const params = new URLSearchParams(hash.slice(1)); // remove leading '#'
      const token = params.get('token');
      const refresh = params.get('refresh');

      setAuthToken(token);
      localStorage.setItem('github_token', token);
      if (refresh) localStorage.setItem('refresh_token', refresh);

      window.history.replaceState(null, '', window.location.pathname);
    } else {
      const savedToken = localStorage.getItem('github_token');
      if (savedToken) setAuthToken(savedToken);
    }
  }, []);

  return [authToken, setAuthToken];
}
 