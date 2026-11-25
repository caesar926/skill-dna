import {Link} from 'react-router-dom';

export default function UnclaimedCard({username, apiBase, isLoggedIn}){
 return(
  <div className="error-state-card">
    <div className="error-icon is-info">i</div>
    <h3>@{username} hasn't been claimed yet</h3>
    <p>Only the owner can unlock the full profile</p>
    {isLoggedIn? <Link className='error-retry-btn' to={`/`}>Back to search</Link> : <a className='error-retry-btn' href={`${apiBase}/auth/login`} >Is this you</a>}   
  </div>
 )
}