import { useState, useEffect } from 'react';
import { useAuthToken } from './useAuthToken';
import { fetchGithubUser, fetchGithubRepos } from '../services/GithubRest';

export function UseGitprofileData(searchedUser, apiBase) {
  const [isLoggedIn, setIsLoggedIn] = useAuthToken(apiBase);
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contributionData, setContributionData] = useState(null);
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

    async function getUser(userName) {
      setLoading(true);
      setError(null);
      setProfileData(null);
      setRepos([]);
      setPinnedRepos([]);
      setContributionData(null);


      async function runGraphqlQuery() {
        const response = await fetch(`${apiBase}/api/graphql?username=${userName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        return response;  
      }

      async function tryRefresh() {
        const response = await fetch (`${apiBase}/auth/refresh`,{
          credentials:'include'
        })
        return response.ok
      }
      
      try {
        let data;
        try {
          data = await fetchGithubUser(userName, controller.signal);
        } catch {
          setError('User not found');
          setLoading(false);
          return;
        }
        setProfileData(data);

        const validRepos = await fetchGithubRepos(userName);
        setRepos(validRepos);

        const stars = validRepos.reduce(
          (acc, repo) => acc + (repo.stargazers_count || 0),
          0
        );

   if (isLoggedIn) {
  try {
    let gqlResponse = await runGraphqlQuery();

    if (gqlResponse.status === 401) {
      const refreshed = await tryRefresh();
      gqlResponse = refreshed ? await runGraphqlQuery() : gqlResponse;
    }

    if (!gqlResponse.ok) {
      setIsLoggedIn(false);
    } else {
      const result = await gqlResponse.json();

      if (result.errors) {
    console.error('GraphQL returned errors:', result.errors);
    setError('Some profile data could not be loaded.');
  }

      const userData = result.data?.user;

      setContributionData(
        userData?.contributionsCollection?.contributionCalendar ?? null
      );
      setActivityMetrics({
        totalCommits: userData?.contributionsCollection?.totalCommitContributions || 0,
        totalPRs: userData?.contributionsCollection?.totalPullRequestContributions || 0,
        totalStars: stars,
      });
      if (userData?.pinnedItems?.nodes?.length > 0) {
        setPinnedRepos(userData.pinnedItems.nodes);
      }
    }
  } catch (gqlErr) {
    console.error('GraphQL Query Error:', gqlErr);
  }
} else {
  setActivityMetrics((prev) => ({ ...prev, totalStars: stars }));
}

        clearTimeout(timeoutId);
        setLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          if (timedOut){
            setError('Request timed out - please check your internet connection.');
          }
          
        } else {
          setError('An error occurred while fetching data.');
        }
        setLoading(false);
      }
    }

    getUser(searchedUser);

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    };
  }, [searchedUser, isLoggedIn]);

  return {
    isLoggedIn,
    profileData,
    repos,
    pinnedRepos,
    loading,
    error,
    contributionData,
    activityMetrics,
  };
}