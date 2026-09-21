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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          {repo.stargazers_count || 0}
        </span>
        <span className="repo-stat">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M18 9v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
            <path d="M12 12v3" />
          </svg>
          {repo.forks_count || 0}
        </span>
      </div>
    </div>
  )
}

export default RepoCard