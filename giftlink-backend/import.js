const fs = require('fs');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'giftsdb';
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('gifts');

    const data = JSON.parse(fs.readFileSync('./sample_data/gifts.json', 'utf8'));

    // Clear existing data if any
    await collection.deleteMany({});

    const result = await collection.insertMany(data);

    const output = `connected to: mongodb://localhost:27017\nimported ${result.insertedCount} documents`;
    console.log(output);
    fs.writeFileSync('./inserted_items', output);
    console.log('Successfully written to inserted_items');
  } catch (err) {
    console.error('Error importing data:', err);
  } finally {
    await client.close();
  }
}

main();