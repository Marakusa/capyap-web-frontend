import "./App.css";
import Auth from './Auth.tsx';
import { useEffect, useState } from "react";
import { logoutUser, getUser, authenticateUser, createJWT } from "./auth";
import type { Models } from "appwrite";
import AppTheme from '../shared-theme/AppTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Header from "./Header.tsx";
import MainPage from "./MainPage";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import UploadPage from "./UploadPage.tsx";
import GalleryPage from "./GalleryPage.tsx";
import Settings from "./Settings.tsx";
import { socket } from "./socket.ts";
import Footer from "./components/Footer.tsx";
import PrivacyPolicy from "./PrivacyPolicy.tsx";
import DocsContainer from "./DocsContainer.tsx";
import TermsOfService from "./TermsOfService.tsx";
import DocsPage from "./DocsPage.tsx";

function App(props: { disableCustomTheme?: boolean }) {
  const [user, setUser] = useState<Models.User | undefined | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    async function onConnect() {
      const jwtToken = await createJWT();
      socket.timeout(5000).emit('userLogin', jwtToken);
    }

    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect);
    };
  }, []);
    
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase(); // make it case-insensitive
    if (ua.includes('capyap/')) {
      setIsDesktop(true);
    }
  }, []);

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

  useEffect(() => {
    async function onUserUpdated() {
      console.log("Received updateUser event from socket");
      checkUser().catch((error) => {
        console.error("Failed to fetch user after socket update:", error);
      });
    }

    socket.on('updateUser-server', onUserUpdated);

    return () => {
      socket.off('updateUser-server', onUserUpdated);
    };
  }, [checkUser]);
  
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
            <Auth user={user} isDesktop={isDesktop} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <MainPage user={user} isDesktop={isDesktop} />
          </>,
    },
    {
      path: "/upload",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} isDesktop={isDesktop} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <UploadPage user={user} />
          </>,
    },
    {
      path: "/gallery",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} isDesktop={isDesktop} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <GalleryPage user={user} />
          </>,
    },
    {
      path: "/settings",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} isDesktop={isDesktop} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <Settings user={user} />
          </>,
    },
    {
      path: "/docs/*",
      element: <>
            <Header user={user} loadingUser={loadingUser} logout={logout} />
            <Auth user={user} isDesktop={isDesktop} authenticating={authenticating || loadingUser} failure={failure} error={error} />
            <DocsContainer />
          </>,
      children: [
        { path: "privacy", element: <PrivacyPolicy /> },
        { path: "terms", element: <TermsOfService /> },
        { path: "*", element: <DocsPage /> },
      ],
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
        <Footer />
      </Container>
    </AppTheme>
  );
}

export default App
