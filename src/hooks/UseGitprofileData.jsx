import { useState, useEffect } from 'react';
import { useAuthToken } from './useAuthToken';
import { fetchGithubUser, fetchGithubRepos } from '../services/GithubRest';

export function UseGitprofileData(searchedUser, apiBase) {
  const [authToken, setAuthToken] = useAuthToken();
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
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    async function getUser(userName) {
      setLoading(true);
      setError(null);
      setProfileData(null);
      setRepos([]);
      setPinnedRepos([]);
      setContributionData(null);

      async function refreshAccessToken() {
        const savedRefreshToken = localStorage.getItem('refresh_token');
        if (!savedRefreshToken) return null;

        const response = await fetch(
          `${apiBase}/auth/refresh?refresh_token=${savedRefreshToken}`
        );
        const data = await response.json();

        if (data.access_token) {
          setAuthToken(data.access_token);
          localStorage.setItem('github_token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
          }
          return data.access_token;
        }

        return null;
      }

      const graphqlQuery = `query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            contributionCalendar {
              totalContributions
              weeks { contributionDays { date contributionCount } }
            }
          }
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                id
                name
                description
                stargazerCount
                forkCount
                primaryLanguage { name color }
                url
              }
            }
          }
        }
      }`;

      async function runGraphqlQuery(token) {
        return fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: graphqlQuery,
            variables: { username: userName },
          }),
        });
      }

      try {
        // 1. REST: Fetch user profile
        let data;
        try {
          data = await fetchGithubUser(userName, controller.signal);
        } catch {
          setError('User not found');
          setLoading(false);
          return;
        }
        setProfileData(data);

        // 2. REST: Fetch repos
        const validRepos = await fetchGithubRepos(userName);
        setRepos(validRepos);

        const stars = validRepos.reduce(
          (acc, repo) => acc + (repo.stargazers_count || 0),
          0
        );

        // 3. GraphQL: Contributions & pinned repos (if authenticated)
        if (authToken) {
          try {
            let gqlResponse = await runGraphqlQuery(authToken);

            if (gqlResponse.status === 401) {
              const newToken = await refreshAccessToken();
              if (newToken) {
                gqlResponse = await runGraphqlQuery(newToken);
              }
            }

            const result = await gqlResponse.json();
            const userData = result.data?.user;

            setContributionData(
              userData?.contributionsCollection?.contributionCalendar ?? null
            );

            setActivityMetrics({
              totalCommits:
                userData?.contributionsCollection?.totalCommitContributions || 0,
              totalPRs:
                userData?.contributionsCollection?.totalPullRequestContributions || 0,
              totalStars: stars,
            });

            if (userData?.pinnedItems?.nodes?.length > 0) {
              setPinnedRepos(userData.pinnedItems.nodes);
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
          setError('Request timed out - please check your internet connection.');
        } else {
          setError('An error occurred while fetching data.');
        }
        setLoading(false);
      }
    }

    getUser(searchedUser);
  }, [searchedUser, authToken]);

  return {
    authToken,
    profileData,
    repos,
    pinnedRepos,
    loading,
    error,
    contributionData,
    activityMetrics,
  };
}