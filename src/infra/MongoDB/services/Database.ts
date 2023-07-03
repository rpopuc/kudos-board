import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import process from "process";
import { Collection } from "./Collection";

export class Database {
  db: mongoDB.Db | null;

  constructor() {
    this.db = null;
  }

  async connect() {
    dotenv.config();
    const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "");
    await client.connect();
    this.db = client.db(process.env.DB_NAME);
  }

  async getCollection<T>(collectionName: string): Promise<Collection<T>> {
    if (!this.db) {
      await this.connect();
    }

    if (!this.db) {
      throw new Error("A conexão com o banco de dados não foi estabelecida.");
    }

    return new Collection<T>(this.db.collection(collectionName));
  }
}
