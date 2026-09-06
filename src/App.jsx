import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { DevProfile } from './components/DevProfile';
import { Analytics } from './components/Analytics';
import { RepoCard } from './components/RepoCard';
import { Heatmap } from './components/Heatmap';
import { Skeleton } from './components/Skeleton';
import './App.css';

function App() {
  const API_BASE = '/api';
  const [searchedUser, setSearchedUser] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [contributionData, setContributionData] = useState(null);

  // State for calculated Activity Metrics
  const [activityMetrics, setActivityMetrics] = useState({
    totalCommits: 0,
    totalPRs: 0,
    totalStars: 0,
  });

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

  // Main Fetch Effect
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
        const savedRefreshToken = localStorage.getItem('refresh_token')
        if (!savedRefreshToken) return null

        const response = await fetch(`${API_BASE}/auth/refresh?refresh_token=${savedRefreshToken}`)
        const data = await response.json()

        if (data.access_token) {
          setAuthToken(data.access_token)
          localStorage.setItem('github_token', data.access_token)
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token)
          }
          return data.access_token
        }

        return null
      }


      try {
        // 1. REST API: Fetch User Profile
        const response = await fetch(`https://api.github.com/users/${userName}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setProfileData(data);

        // 2. REST API: Fetch User Public Repositories
        const getResponse = await fetch(`https://api.github.com/users/${userName}/repos?per_page=100`);
        const reposData = await getResponse.json();
        const validRepos = Array.isArray(reposData) ? reposData : [];
        setRepos(validRepos);

        // Calculate Total Stars across repos
        const stars = validRepos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);

        // 3. GraphQL API: Fetch Contributions & Pinned Repositories (If token exists)
        if (authToken) {
          try {



            let gqlResponse = await fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                query: `query($username: String!) {
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
                }`,
                variables: { username: userName },
              }),
            })
            if (gqlResponse.status === 401) {
              const newToken = await refreshAccessToken()
              if (newToken) {
               gqlResponse = await fetch('https://api.github.com/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${newToken}`,
              },
              body: JSON.stringify({
                query: `query($username: String!) {
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
                }`,
                variables: { username: userName },
              }),
            }) 
            }
          }
            const result = await gqlResponse.json()


            const userData = result.data?.user;

            setContributionData(userData?.contributionsCollection?.contributionCalendar ?? null);

            setActivityMetrics({
              totalCommits: userData?.contributionsCollection?.totalCommitContributions || 0,
              totalPRs: userData?.contributionsCollection?.totalPullRequestContributions || 0,
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

  // Helper function to tally language usage
  function tallyLanguages(repoList) {
    if (!Array.isArray(repoList)) return {};
    return repoList.reduce((counts, repo) => {
      const lang = repo.language;
      if (!lang) return counts;
      counts[lang] = (counts[lang] || 0) + 1;
      return counts;
    }, {});
  }

  const languageCounts = tallyLanguages(repos);
  const total = Object.values(languageCounts).reduce((sum, n) => sum + n, 0);

  return (
    <div className="App">
      <SearchBar
      onSearch={setSearchedUser}
      authToken={authToken}
      apiBase={API_BASE}
    />
     
      {loading && <Skeleton />}

      {error && !loading && <p className="status-msg error-msg">Error: {error}</p>}

      {profileData && !loading && (
        <main className="dashboard-container">
          <aside className="left-sidebar">
            <DevProfile profile={profileData} />
          </aside>

          <section className="main-content">
            <header className="content-headline">
              <h2>Proof-of-Work</h2>
              <p>Data parsed from an authenticated user profile.</p>
            </header>

            <div className="metrics-row">
              <div className="metric-card">
                <h4>Total Stars</h4>
                <p>{activityMetrics.totalStars}</p>
              </div>
              <div className="metric-card">
                <h4>Commits This Year</h4>
                <p>{activityMetrics.totalCommits}</p>
              </div>
              <div className="metric-card">
                <h4>Pull Requests</h4>
                <p>{activityMetrics.totalPRs}</p>
              </div>
            </div>

            {/* Analytics Section */}
            {total > 0 ? (
              <Analytics languageCounts={languageCounts} total={total} />
            ) : (
              <div className="empty-state-card">
                <p>No public language statistics detected for this account.</p>
              </div>
            )}

            {/* Repositories Section */}
            <h3 className="section-title">
              {pinnedRepos.length > 0 ? 'Pinned Repositories' : 'Repositories'}
            </h3>

            {repos.length === 0 ? (
              <div className="empty-state-card">
                <p>This user has no public repositories available.</p>
              </div>
            ) : (
              <div className="repo-grid">
                {(pinnedRepos.length > 0 ? pinnedRepos : repos).map((repo) => (
                  <RepoCard key={repo.id || repo.name} repo={repo} />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      <Heatmap contributionData={contributionData} />
    </div>
  );
}

export default App;