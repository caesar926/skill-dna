import { useEffect, useState} from "react";

export function useAnalysisMessages(loading, messages = ["Analyzing GitHub profile...", "Scanning repositories and contributions...", "Building developer analysis..."]) {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!loading) return;

    setCurrentIndex(0)

    if (loading) {
      const interval =setInterval(() => {
        setCurrentIndex(prev => 
          Math.min(prev + 1, messages.length - 1)
        )
      }, 1200)

    return () => clearInterval(interval);
    }
  }, [loading, messages])

  return messages[currentIndex] 
}