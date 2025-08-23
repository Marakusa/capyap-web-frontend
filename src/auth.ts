import { account, client } from "./appwrite";
import config from './local.config.json';
import { setItem, getItem } from "./storage";

export const loginWithDiscord = async () => {
  try {
    localStorage.removeItem("aw_jwt");
    localStorage.removeItem("cookieFallback");
    localStorage.removeItem("uploadKey");
    window.location.href = config.backend.url + "/oauth";
  } catch (error) {
    console.error(error);
  }
}

export const authenticateUser = async (userId: string, secret: string) => {
  try {
    // Create a session using the userId and secret
    await account.createSession(userId, secret);
    await fetchUploadKey();
  } catch (error) {
    await account.deleteSession('current');
    console.error("Fetching upload key failed:", error);
  }
}

export const fetchUploadKey = async () => {
  try {
    // Fetch upload key from the server
    const formData = new FormData();

    const sessionJwt = await createJWT();
    if (sessionJwt) {
        formData.append("sessionKey", sessionJwt);
    }

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
    return data.uploadKey;
  } catch (error) {
    console.error(error);
    return null;
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
    let jwtKey = getItem("aw_jwt");
    if (!jwtKey) {
      const sessionJwt = await account.createJWT();
      if (!sessionJwt?.jwt) {
        await account.deleteSession('current');
        throw new Error("Failed to fetch session");
      }
      setItem("aw_jwt", sessionJwt.jwt);
    }
    jwtKey = getItem("aw_jwt");
    if (jwtKey) {
      client.setJWT(jwtKey);
    }
    return jwtKey;
  } catch (error) {
    console.error(error);
  }
}
