import { account } from "./appwrite";
import config from './local.config.json';

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
    await account.createSession(userId, secret);

    // Fetch session
    const sessionJwt = await account.createJWT();
    if (!sessionJwt?.jwt) {
      await account.deleteSession('current');
      throw new Error("Failed to fetch session");
    }

    // Fetch upload key from the server
    const formData = new FormData();
    formData.append("sessionKey", sessionJwt.jwt);
    const uploadKeyUrl = config.backend.url + "/user/getUploadKey";
    const response = await fetch(uploadKeyUrl, {
        method: "POST",
        body: formData
    });
    if (!response.ok) {
        await account.deleteSession('current');
        const errorMessage = await response.text();
        throw new Error(`${errorMessage}`);
    }
    const data = await response.json();
    localStorage.setItem("uploadKey", data.uploadKey);
  } catch (error) {
    await account.deleteSession('current');
    console.error("Fetching upload key failed:", error);
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

export const createJWT = async () => {
  try {
    return await account.createJWT();
  } catch (error) {
    console.error(error);
  }
}
