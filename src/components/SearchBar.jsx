import { useState } from 'react';
import { AuthControl } from '../components/AuthControl';
import './SearchBar.css';

export function SearchBar({ onSearch, authToken, apiBase }) {
  const [userName, setUserName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = userName.trim();
    if (name) onSearch(name);
  };

  return (
    <header className="search-header">
      <div className="search-header-brand">
        <h1 className="search-header-logo">
          <span className="search-header-initial">S</span>
          <span className="search-header-accent">KILL</span>
          <span className="search-header-rest">DNA</span>
        </h1>
        <div className="search-header-tagline">PROVE YOUR CODE</div>
      </div>

      <form className="search-header-search" onSubmit={handleSubmit} role="search">
        <input
          className="search-header-input"
          type="text"
          aria-label="Search developer"
          placeholder="Search developer..."
          value={userName}
          onChange={(event) => setUserName(event.target.value)}
          autoComplete="off"
        />
        <button
          className="search-header-submit"
          type="submit"
          aria-label="Search"
        >
          <img className="search-header-icon" src="/icons/search.svg" alt="" />
        </button>
      </form>

      <AuthControl apiBase={apiBase} authToken={authToken} />
    </header>
  );
}

export default SearchBar;
