import "./App.css";
import Auth from './Auth.tsx';
import { useEffect, useState } from "react";
import { logoutUser, getUser, authenticateUser } from "./auth";
import type { Models } from "appwrite";
import AppTheme from '../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from "./Header.tsx";
import DownloadPage from "./DownloadPage.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import UploadPage from "./UploadPage.tsx";
import GalleryPage from "./GalleryPage.tsx";

function App(props: { disableCustomTheme?: boolean }) {
  const [user, setUser] = useState<Models.User | undefined | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const checkUser = async () => {
    try {
      const userData = await getUser();
      if (userData) {
        setUser(userData);
        setLoadingUser(false);
      } else {
        setUser(null);
        setLoadingUser(false);
      }
    } catch (error) {
      setUser(null);
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);
  
  const logout = async () => {
      await logoutUser();
      setUser(null);
  }

  // Get query parameters
  const queryParams = new URLSearchParams(window.location.search);
  const authSecret = queryParams.get("secret");
  const userId = queryParams.get("userId");
  const failure = queryParams.get("failure");
  const error = queryParams.get("error");
  if (authSecret && userId) {
    setAuthenticating(true);
    window.history.replaceState({}, document.title, window.location.pathname);
    authenticateUser(userId, authSecret).then(() => {
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <DownloadPage user={user} />
          </>,
    },
    {
      path: "/upload",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <UploadPage user={user} />
          </>,
    },
    {
      path: "/gallery",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <GalleryPage user={user} />
          </>,
    },
  ]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </Container>
    </AppTheme>
  );
}

export default App
