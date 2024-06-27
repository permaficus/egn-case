import dotenv from 'dotenv';
dotenv.config().parsed;

export const SERVICE_LOCAL_PORT = process.env.SERVICE_LOCAL_PORT
export const NODE_ENV = process.env.NODE_ENV
/**
 * A list for CORS policy
 * Leave empty array to allow from all(*)
 */
export const allowedOrigin: any = []