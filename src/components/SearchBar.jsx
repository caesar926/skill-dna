import { useState } from 'react'
import { useClaimProfile } from '../hooks/useClaimProfile'
import './SearchBar.css'

export function SearchBar({ onSearch, authToken, apiBase }) {
  const [userName, setUserName] = useState('')
  const { claimStatus, errorMessage, claimProfile } = useClaimProfile(apiBase);

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
        <div >
          <button
            className='searchBtn'
            onClick={() => onSearch(userName)}><img className='img' src="icons/search.svg" /></button>
        </div>

        <input
          className='input'
          placeholder='Search developer...'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>


      <div className="right">
        {!authToken ? (
          <a href={`${apiBase}/auth/login`} className="github-login-btn">
            Login with GitHub
          </a>
        ) : (
          <>
            <span className="auth-badge">Authenticated</span>

            <div className='status'>
              {
                claimStatus === "idle" ? (<button onClick=
                  {claimProfile}>Claim your profile</button>
                ) : claimStatus === "loading" ? (
                  <button disabled >Claiming...</button>
                ) : claimStatus === "success" ? (
                  <span>Profile claimed </span>
                ) : (
                  <div>
                    error{errorMessage}
                    <button onClick=
                      {claimProfile}>Claim your profile</button>
                  </div>

                )
              }
            </div>
          </>

        )}

      </div>
    </div>
  );
}

export default SearchBar
