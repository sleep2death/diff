import { createClient } from 'redis';

export const client = createClient();
await client.connect();

client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis Client connected'));
