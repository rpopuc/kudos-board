import process from "process";
import { config as dotEnvConfig } from "dotenv";
import { MongoClient, Db, OptionalId, Document } from "mongodb";
import { Collection } from "./Collection";

export class Database {
  db: Db | null;

  constructor() {
    this.db = null;
  }

  async connect() {
    dotEnvConfig();
    const client = new MongoClient(process.env.DB_CONN_STRING || "");
    await client.connect();
    this.db = client.db(process.env.DB_NAME);
    console.log("Connected successfully to database: " + process.env.DB_CONN_STRING);
  }

  async getCollection<T extends OptionalId<Document>>(collectionName: string): Promise<Collection<T>> {
    if (!this.db) {
      await this.connect();
    }

    if (!this.db) {
      throw new Error("The connection with the database was not established.");
    }

    return new Collection<T>(this.db.collection(collectionName));
  }
}
