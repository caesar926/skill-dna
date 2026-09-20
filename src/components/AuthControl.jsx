import { useClaimProfile } from '../hooks/useClaimProfile'

export function AuthControl({apiBase, authToken}) {
  const { claimStatus, errorMessage, claimProfile } = useClaimProfile(apiBase);

  return(
    <>
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
    </>
  )
}