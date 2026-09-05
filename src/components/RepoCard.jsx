import './RepoCard.css'

export function RepoCard({ repo }) {
  const getLanguageColor = (lang) => {
    if (!lang) return 'transparent';
    const lowerLang = lang.toLowerCase();
    if (lowerLang === 'javascript') return 'var(--color-primary)';
    if (lowerLang === 'python') return 'var(--color-success)';
    return 'var(--color-secondary)';
  };

  return (
    <div className="repo-card">
      <div className="repo-card-top">
        <a
          className="repo-link"
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
        >
          {repo.name}
        </a>
        {repo.language && (
          <div className="repo-lang-container">
            <span
              className="lang-dot"
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            ></span>
            <span className="lang-label">{repo.language}</span>
          </div>
        )}
      </div>

      <p className="repo-desc">
        {repo.description || 'No description provided for this repository.'}
      </p>

      <div className="repo-divider"></div>

      <div className="repo-card-bottom">
        <span className="repo-stat">
          ⭐ {repo.stargazers_count || 0}
        </span>
        <span className="repo-stat">
          🍴 {repo.forks_count || 0}
        </span>
      </div>
    </div>
  )
}

export default RepoCard