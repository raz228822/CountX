import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function saveCounterToDatabase(text) {
  try {
    const db = (await clientPromise).db("countx-db");
    const collection = db.collection("counters");

    // Insert the text into the collection
    const result = await collection.insertOne({ text });
    console.log("Text saved to database:", result);
  } catch (error) {
    console.error("Error saving text:", error);
  }
}
