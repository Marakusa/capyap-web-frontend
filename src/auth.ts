import { account } from "./appwrite";
import config from './local.config.json';

export const loginWithDiscord = async () => {
  try {
    // Redirect the client to the backend for OAuth
    window.location.href = `${config.backend.url}/oauth/discord`;
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

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
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
