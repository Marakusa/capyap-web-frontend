import { Client, Account, OAuthProvider } from 'appwrite';
import config from './local.config.json';

// Initialize Appwrite
const client = new Client()
    .setEndpoint(config.appwrite.endpoint)
    .setProject(config.appwrite.project);

const account = new Account(client)

export { client, account, OAuthProvider }