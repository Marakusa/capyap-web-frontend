import { useEffect, useState } from "react";
import { loginWithDiscord, logoutUser, getUser, authenticateUser } from "./auth";
import type { Models } from "appwrite";
import LoadingDots from "./LoadingDots";

function Auth() {
  const [user, setUser] = useState<Models.User | undefined | null>(null);
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const checkUser = async () => {
    try {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
      } else {
        console.log("No user is logged in.");
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  // Get query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const authSecret = queryParams.get("secret");
  const userId = queryParams.get("userId");
  if (authSecret && userId) {
    setAuthenticating(true);
    window.history.replaceState({}, document.title, window.location.pathname);
    authenticateUser(userId, authSecret).then(() => {
      console.log("User authenticated successfully");
      checkUser().catch((error) => {
        console.error("Failed to fetch user after authentication:", error);
      }).finally(() => {
        setAuthenticating(false);
      });
    }).catch((error) => {
      console.error("Authentication failed:", error);
      setUser(null);
      setAuthenticating(false);
    });
  }

  const logout = async () => {
    await logoutUser();
    setUser(null);
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="card w-9/10 max-w-100 min-h-50 flex flex-col justify-center items-center gap-4">
          {user ? (
            <>
              <p>Welcome, {user.name}!</p>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            authenticating ? (
              <>
                <LoadingDots size="sm" className="text-gray-500" />
              </>
            ) : (
              <>
                <p className="mb-6">
                  Login with Discord to use the ScreenCapture app.
                </p>
                <button onClick={() => loginWithDiscord()}>
                  Log In with Discord
                </button>
              </>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default Auth
