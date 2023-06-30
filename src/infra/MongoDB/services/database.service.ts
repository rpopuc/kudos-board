import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import process from "process";

export const collections: { games?: mongoDB.Collection } = {}

export async function connectToDatabase ()
{
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "");

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const gamesCollection: mongoDB.Collection = db.collection(process.env.GAMES_COLLECTION_NAME || "games");

  collections.games = gamesCollection;

  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`);
}

connectToDatabase();