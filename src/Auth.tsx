import { loginWithDiscord } from "./auth";
import type { Models } from "appwrite";
import LoadingDots from "./LoadingDots";
import Button from '@mui/material/Button';
import { FaDiscord } from "react-icons/fa";
import Card from '@mui/material/Card';

function Auth({ user, authenticating, failure, error }: {user: Models.User | undefined | null, authenticating: boolean, failure: string | null, error: string | null}) {
  return (
    <>
      {!user && (
        authenticating ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <Card className="w-9/10 max-w-120 min-h-50 flex flex-col justify-center items-center p-6">
              <LoadingDots size="sm" className="text-gray-500" />
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[70vh]">
            <Card className="w-9/10 max-w-120 min-h-50 flex flex-col justify-center items-center p-6">
              <p className="mb-6">
                Login with Discord to use the CapYap app.
              </p>
              <Button variant="contained" color="primary" onClick={loginWithDiscord} startIcon={<FaDiscord />}>
                Log In with Discord
              </Button>
              {failure && (
                <p className="text-red-500">
                  Authentication failed: '{error}'. Please try again.
                </p>
              )}
            </Card>
          </div>
        )
      )}
    </>
  )
}

export default Auth
