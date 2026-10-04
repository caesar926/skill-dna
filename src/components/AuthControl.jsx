import { useClaimProfile } from '../hooks/useClaimProfile';
import './AuthControl.css';

export function AuthControl({ apiBase, authToken }) {
  const { claimStatus, errorMessage, claimProfile } = useClaimProfile(apiBase);

  if (!authToken) {
    return (
      <div className="auth-control">
        <a href={`${apiBase}/auth/login`} className="auth-login-btn">
          Login with GitHub
        </a>
      </div>
    );
  }

  return (
    <div className="auth-control">
      <span className="auth-badge">Authenticated</span>

      <div className="auth-claim">
        {claimStatus === 'idle' && (
          <button className="auth-claim-btn" onClick={claimProfile}>
            Claim your profile
          </button>
        )}

        {claimStatus === 'loading' && (
          <button className="auth-claim-btn" disabled>
            Claiming...
          </button>
        )}

        {claimStatus === 'success' && (
          <span className="auth-claim-done">Profile claimed</span>
        )}

        {claimStatus !== 'idle' &&
          claimStatus !== 'loading' &&
          claimStatus !== 'success' && (
            <div className="auth-claim-error" role="alert">
              <span className="auth-claim-error-text">
                Error: {errorMessage}
              </span>
              <button className="auth-retry-btn" onClick={claimProfile}>
                Claim your profile
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default AuthControl;
