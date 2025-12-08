import { MongoClient } from 'mongodb';

/**
 * MongoDB Connection Singleton
 * Reuses the same connection across requests to avoid connection overhead
 */

let cachedClient: MongoClient | null = null;
let cachedDb: ReturnType<MongoClient['db']> | null = null;

export async function getMongoDb() {
  if (cachedClient && cachedDb) {
    console.log('📌 Reusing cached MongoDB connection');
    return cachedDb;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    console.log('🔗 Creating new MongoDB connection...');
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      minPoolSize: 2,
      waitQueueTimeoutMS: 10000,
    });

    await client.connect();
    cachedClient = client;
    cachedDb = client.db('portfolioDB');

    console.log('✅ MongoDB connected and cached');
    return cachedDb;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }
}

export async function closeMongoDb() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('🔌 MongoDB connection closed');
  }
}
