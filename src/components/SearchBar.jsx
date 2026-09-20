import { useState } from 'react'
import {AuthControl} from '../components/AuthControl'
import './SearchBar.css'

export function SearchBar({ onSearch, authToken, apiBase }) {
  const [userName, setUserName] = useState('')


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(userName);
    }
  };

  return (
    <div className='header'>

      <div className='left'>
        <h1 className='left-header'>
          <span className='letter-S'>S</span>

          <span className='rest-of-logo'>KILL</span>

          <span className='cred'>DNA</span></h1>
        <div className='left-subText'>PROVE YOUR CODE</div>
      </div>


      <div className='middle'>
     
     <button
            className='searchBtn'
            onClick={() => onSearch(userName)}><img className='img' src="icons/search.svg" /></button>
        <input
          className='input'
          placeholder='Search developer...'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={handleKeyDown}
        />

      </div>

      {<AuthControl apiBase={apiBase} authToken={authToken} />}
    </div>
  
    
  );
}

export default SearchBar