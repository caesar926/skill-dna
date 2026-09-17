import { useState } from "react";

export function useSuggestions(username, apiBase) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState("idle");
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading("loading");
    try {
      const response = await fetch(`${apiBase}/api/profile/${username}/suggestions`);
      if (!response.ok) {
        const errorMessage = await response.json();
        setError(errorMessage.error || "Failed to fetch suggestions");
        setLoading("error");
        return;
      }
      const data = await response.json();
      setSuggestions(data);
      setLoading("success");
    } catch (err) {
      setError(err.message);
      setLoading("error");
    }
  };

  return {
    suggestions,
    loading,
    error,
    fetchSuggestions,
  };
}