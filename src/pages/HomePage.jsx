import { useState, useEffect } from 'react';
import { AuthControl } from '../components/AuthControl';
import { calculateScore } from '../utils/proofOfWorkScore';

const demoUsers = [
  'caesar926',
  'torvalds',
  'gaearon',
  'sindresorhus',
  'addyosmani',
  'tj'
]

export function HomePage({ onSearch, apiBase, isLoggedIn }) {
  const [userName, setUserName] = useState('');
  const [demoProfiles, setDemoProfiles] = useState({});

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(userName);
    }
  };

  useEffect(() => {
    const fetchDemoProfiles = async () => {
      const data = await Promise.all(
        demoUsers.map(async (name) => {
          const response = await fetch(
            `${apiBase}/api/public/profile/${name}`
          );

          const profile = await response.json()
          const score = calculateScore(profile)
          const finalScore = score.finalScore
          return {
            username: name,
            score: finalScore
          }
        })
      );

      const scores = {}
      data.forEach((profile) => {
        scores[profile.username] = profile.score;
      });

      setDemoProfiles(scores);
    };

    fetchDemoProfiles()
  }, [apiBase]);

  function getScoreColor(score) {
    if (score <= 25) return 'red'
    if (score <= 50) return 'orange'
    if (score <= 75) return 'green'
    else return 'blue'
  }

  return (
    <>
      <div className="hero-auth-fixed">
        <AuthControl apiBase={apiBase} authToken={isLoggedIn} />
      </div>

      <section className="homepage-hero">
        <div className="hero-card">

          <div className="hero-content">
            <h1 className="hero-title">Developer Search</h1>
            <p className="hero-subtitle">Search and verify developer proof-of-work scores</p>

            <div className="page-search-container">
              <img className="search-icon-inline" src="icons/search.svg" alt="" />
              <input
                className="page-search-input"
                type="text"
                placeholder="Search developer username..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="page-search-btn"
                onClick={() => onSearch(userName)}
                type="button"
                aria-label="Search"
              >
                <img src="icons/search.svg" alt="Search" />
              </button>
            </div>
          </div>

          <div className="quick-users-viewport">
            <div className="quick-users-row">
              {[...Array(2)].flatMap((_, dup) =>
                demoUsers.map((name) => {
                  const score = demoProfiles[name];

                  return (
                    <button
                      key={`${name}-${dup}`}
                      type="button"
                      className="quick-user-card"
                      onClick={() => onSearch(name)}
                    >
                      <img
                        src={`https://github.com/${name}.png`}
                        alt={name}
                        className="quick-user-avatar"
                      />

                      <span className="quick-user-name">{name}</span>

                      {score !== undefined && (
                        <span className={`quick-user-score ${getScoreColor(score)}`}>
                          <div><span className='span'>Proof of work .</span> {Math.round(score)}</div>
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
