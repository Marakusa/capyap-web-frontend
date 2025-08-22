import { account } from "./appwrite";
import config from './local.config.json';
import Cookies from 'universal-cookie';

export const loginWithDiscord = async () => {
  try {
    window.location.href = config.backend.url + "/oauth";
  } catch (error) {
    console.error(error);
  }
}

export const authenticateUser = async (userId: string, secret: string) => {
  try {
    // Create a session using the userId and secret
    const session = await account.createSession(userId, secret);
    console.log("User authenticated successfully: ", session);
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}

export const newSession = async (userId: string, secret: string) => {
  try {
    // Create the session using the Appwrite client
    const session = await account.createSession(userId, secret);

    // Set the session cookie
    const cookies = new Cookies();
    cookies.set('a_session_' + config.appwrite.project, session.secret, { // Use the session secret as the cookie value
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(session.expire),
      path: '/'
    });
    console.log("New session created successfully: ", session);
    return session;
  } catch (error) {
    console.error("Failed to create new session:", error);
    throw error;
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error(error);
  }
}

export const getSession = async () => {
  try {
    return await account.getSession('current');
  } catch (error) {
    console.error(error);
  }
}

export const getUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error(error);
  }
}
