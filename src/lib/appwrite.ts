import { Client, Account, Databases } from 'appwrite';

const APPWRITE_CONFIG = {
    ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '',
    PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '',
    DATABASE: process.env.NEXT_PUBLIC_APPWRITE_DATABASE || '',
    COLLECTION: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ASISTENTES || 'asistentes',
};

const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.ENDPOINT)
    .setProject(APPWRITE_CONFIG.PROJECT);

export const account = new Account(client);
export const databases = new Databases(client);

export { APPWRITE_CONFIG };
export default client;
