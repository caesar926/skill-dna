import { useState, useEffect } from 'react';
import { useAuthToken } from './useAuthToken';

export function UseGitprofileData(searchedUser, apiBase, searchTrigger) {
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
  let ignore = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 15000);

  const gitData = async () => {
    setLoading(true);
    setError(null);
    setProfileData(null);
    setPinnedRepos([]);
    setContributionData(null);
    setLanguageCounts({});

    try {
      const response = await fetch(`${apiBase}/api/public/profile/${searchedUser}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });

      if (ignore) return;

      if (!response.ok) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (ignore) return;

      setLoading(false);
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
      setContributionData(data.data?.contributionsCollection?.contributionCalendar ?? null);
      setPinnedRepos(data.data.pinnedItems.nodes);
      setLanguageCounts(data.data.languageCounts ?? {});
    } catch (err) {
      if (ignore) return;
      if (err.name === 'AbortError' && timedOut) {
        setError('Request timed out - please check your internet connection.');
      } else if (err.name === 'AbortError' && !timedOut) {
        // normal cleanup abort — stay silent
      } else {
        setError('An error occurred while fetching data.');
      }
      setLoading(false);
    }
  };

  gitData();

  return () => {
    ignore = true;
    controller.abort();
    clearTimeout(timeoutId);
  };
}, [searchedUser, isLoggedIn, searchTrigger]);

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

