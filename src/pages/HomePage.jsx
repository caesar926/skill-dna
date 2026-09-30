import { useEffect, useState } from 'react';
import { AuthControl } from '../components/AuthControl';
import { calculateScore } from '../utils/proofOfWorkScore';
import './HomePage.css';

const developers = [
  'caesar926', 
  'torvalds', 
  'gaearon', 
  'sindresorhus', 
  'addyosmani', 
  'tj'
];

export function HomePage({ onSearch, apiBase, isLoggedIn }) {
  const [userName, setUserName] = useState('');
  const [scores, setScores] = useState({});

  useEffect(() => {
    let active = true;
    Promise.allSettled(developers.map(async (name) => {
      const response = await fetch(`${apiBase}/api/public/profile/${name}`);
      if (!response.ok) throw new Error('Profile unavailable');
      return { 
        name, 
        score: calculateScore(await response.json()).finalScore };
    })).then((results) => {
      if (!active) return;
      const next = {};
      results.forEach((result) => {
        if (result.status === 'fulfilled') next[result.value.name] = result.value.score;
      });
      setScores(next);
    });
    return () => { active = false; };
  }, [apiBase]);

  const search = (event) => {
    event.preventDefault();
    if (userName.trim()) onSearch(userName.trim());
  };

  return (
    <main className="skill-home">
      <header className="skill-home-header">
        <a 
        className="skill-home-brand" 
        href="/" 
        aria-label="SkillDNA home">
          <span className="brand-initial">S</span>
          <span className="brand-green">KILL</span>
           DNA
          </a>
        <div className="skill-home-auth">
          <AuthControl 
          apiBase={apiBase} 
          authToken={isLoggedIn} />
        </div>
      </header>
      <section className="skill-home-hero" aria-labelledby="home-title">
        <div className="skill-home-hero-inner">
          <div className="skill-home-eyebrow">
            <span className="skill-home-dot" /> 
            DEVELOPER INTELLIGENCE / GITHUB
            </div>
          <h1 id="home-title">Decode developer 
            <span> DNA.</span>
          </h1>
           <p>
            Look beyond the résumé. Search a GitHub username to explore real repositories, languages, and proof of work.
            </p>
          <form 
          className="skill-home-search" 
          onSubmit={search} 
          role="search"
          >
          

            <input 
            type="text" 
            aria-label="GitHub username" placeholder="Enter a GitHub username" 
            value={userName} 
            onChange={(event) => setUserName(event.target.value)} 
            autoComplete="off" 
            />
            <button 
            type="submit"
            >Analyze
            </button>
          </form>
          <div className="skill-home-note">
            PUBLIC GITHUB PROFILES · NO SIGN-IN NEEDED TO SEARCH
          </div>
        </div>
      </section>
      <section className="skill-home-discover" aria-labelledby="discover-title">
        <div className="skill-home-heading"><div>
          <h2 id="discover-title">Explore developers</h2>
          </div>
          </div>
        <div className="skill-home-carousel" aria-label="Developer profiles">
          <div className="quick-users-viewport">
            <div className="quick-users-row">
               <div className="skill-home-track">
            {[...developers, ...developers].map((name, index) => (
              <button 
              type="button" 
              className="skill-home-card" 
              key={`${name}-${index}`} 
              onClick={() => onSearch(name)} 
              aria-label={`Analyze ${name}`} 
              tabIndex={index < developers.length ? 0 : -1}>
                <span className="skill-home-card-top">
                  <img 
                  src={`https://github.com/${name}.png`} alt="" 
                  loading="lazy" />
                  <span aria-hidden="true"></span>
                  </span>
                <span className="skill-home-card-name">{name}</span>
                <span className="skill-home-card-kind">GITHUB PROFILE</span>
                <span className="skill-home-card-bottom"><span>PROOF OF WORK</span><strong>{Number.isFinite(scores[name]) ? Math.round(scores[name]) : '—'}</strong></span>
              </button>
            ))}
          </div>
            </div>
          </div>
         
        </div>
      </section>
    </main>
  );
}

export default HomePage;
