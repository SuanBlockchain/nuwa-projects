import { FireblocksSDK } from "fireblocks-sdk";

const apiKey = process.env.FIREBLOCKS_API_KEY!;
const privateKey = process.env.FIREBLOCKS_SECRET_KEY_PEM!;
const baseUrl = process.env.FIREBLOCKS_BASE_URL || "https://api.fireblocks.io";

export const fireblocks = new FireblocksSDK(privateKey, apiKey, baseUrl);
