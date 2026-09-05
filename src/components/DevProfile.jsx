import './DevProfile.css'

export function DevProfile({ profile }) {
  if (!profile) return null;

  return (
    <div className="profile-card">
      <div className="avatar-wrapper">
        <img
          src={profile.avatar_url}
          alt={profile.login}
          className="profile-avatar"
        />
      </div>

      <h2 className="profile-username">@{profile.login}</h2>
     
      <p className="profile-bio">
        {profile.bio || 'React & JavaScript Developer. Building clean UIs with plain CSS.'}
      </p>

      <div className="profile-meta">
        <h3 className="meta-title">Meta</h3>
        <div className="meta-item">
          <span className="meta-label">Public Repos:</span>
          <span className="meta-value">{profile.public_repos}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Followers:</span>
          <span className="meta-value">{profile.followers}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Verified:</span>
          <span className="meta-value status-tag">GitHub</span>
        </div>
      </div>
    </div>
  );
}

export default DevProfile;