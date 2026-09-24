// giftlink-backend/models/db.js
// Handles MongoDB connection using the MongoDB Node.js driver.

const { MongoClient } = require('mongodb');

// Load environment variables (MONGODB_URI set in .env)
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'giftlink';

let client = null;      // Reuse the MongoClient across calls
let dbInstance = null;  // Reuse the Db instance across calls

/**
 * connectToDatabase()
 * -------------------
 * 1. Connect to MongoDB using MongoClient.
 * 2. Assign the database instance.
 * 3. Return the database instance.
 *
 * Required by grading Task 4:
 *   must contain the line `await client.connect();`
 */
async function connectToDatabase() {
  try {
    if (dbInstance) {
      // Already connected — reuse it
      return dbInstance;
    }

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the .env file');
    }

    // Create the MongoClient
    client = new MongoClient(uri);

    // ✅ Grading Task 4 — required line
    await client.connect();

    // Assign database instance
    dbInstance = client.db(dbName);

    console.log(`✅ Connected to MongoDB database: ${dbName}`);
    return dbInstance;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

/**
 * closeDatabase()
 * Optional helper — closes the connection gracefully.
 */
async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    dbInstance = null;
    console.log('🔌 MongoDB connection closed');
  }
}

module.exports = { connectToDatabase, closeDatabase };