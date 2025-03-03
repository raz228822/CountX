import { timeEnd } from "console";
import { MongoClient } from "mongodb";
// import prisma from '../../app/db.server'

const uri = process.env.MONGO_URI;
let client;
let clientPromise;

if (!clientPromise) {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}


export async function saveCounterToDatabase({text, dateObject, time, shop}) {
  try {
    const result = await prisma.countdown.create({
      data: {
        text, // The sale text input by the user
        date: dateObject,
        time: time,
        createdAt: new Date(), // Current time for createdAt
        shop: shop
      },
    });

    console.log('Countdown saved to database:', result);
  } catch (error) {
    console.error('Error saving countdown:', error);
  }
}


// export async function saveCounterToDatabase(text) {
//   try {
//     const db = (await clientPromise).db("countx-db");
//     const collection = db.collection("counters");

//     // Insert the text into the collection
//     const result = await collection.insertOne({ text });
//     console.log("Text saved to database:", result);
//   } catch (error) {
//     console.error("Error saving text:", error);
//   }
// }
