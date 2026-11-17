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

      <span className='sd-logo'>
          <span className='sd-mark' aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>

          <span className='sd-word'>Skill<b>DNA</b></span>
        </span>

    
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
