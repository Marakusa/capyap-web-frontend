import { account, OAuthProvider } from "./appwrite";
import config from './local.config.json';

export const loginWithDiscord = async () => {
  try {
    const redirectUrl = await account.createOAuth2Session(
        OAuthProvider.Discord,
        config.appwrite.redirectUrl,
        config.appwrite.redirectUrlError
    );

    // Check if a URL was returned.
    if (redirectUrl) {
      console.log(redirectUrl);
      //window.location.href = redirectUrl;
    }
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
