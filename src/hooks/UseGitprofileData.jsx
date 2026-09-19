import { useState, useEffect } from 'react';
import { useAuthToken } from './useAuthToken';

export function UseGitprofileData(searchedUser, apiBase) {
  const [isLoggedIn, setIsLoggedIn] = useAuthToken(apiBase);
  const [profileData, setProfileData] = useState(null);
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contributionData, setContributionData] = useState(null);
  const [languageCounts, setLanguageCounts] = useState({});
  const [activityMetrics, setActivityMetrics] = useState({
    totalCommits: 0,
    totalPRs: 0,
    totalStars: 0,
  });

  useEffect(() => {
    if (!searchedUser) return;
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);
    try{
       const gitData = async () => {
      setLoading(true);
      setError(null);
      setProfileData(null);
      setPinnedRepos([]);
      setContributionData(null);
      setLanguageCounts({});

      const response = await fetch(`${apiBase}/api/public/profile/${searchedUser}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setLoading(false);
      setIsLoggedIn(true)
      setProfileData({
        avatar_url: data.data.avatarUrl,
        login: data.github_username,
        followers: data.data.followers.totalCount,
        public_repos: data.data.repositories.totalCount,
        bio: data.data.bio,
      });
      setActivityMetrics({
        totalCommits: data.data?.contributionsCollection?.totalCommitContributions || 0,
        totalPRs: data.data?.contributionsCollection?.totalPullRequestContributions || 0,
        totalStars: data.total_stars,
      });
      setContributionData(
        data.data?.contributionsCollection?.contributionCalendar ?? null
      );
      setPinnedRepos(data.data.pinnedItems.nodes);
      setLanguageCounts(data.data.languageCounts ?? {});
    };

     gitData();
    }catch(error){
      error 
    }

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchedUser, isLoggedIn]);

  return {
    isLoggedIn,
    profileData,
    pinnedRepos,
    loading,
    error,
    contributionData,
    languageCounts,
    activityMetrics,
  };
}

