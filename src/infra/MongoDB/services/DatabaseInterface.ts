import { MongoClient, Db, OptionalId, Document } from "mongodb";
import { Collection } from "./Collection";

export interface DatabaseInterface {
  connect(): Promise<void>;

  getCollection<T extends OptionalId<Document>>(collectionName: string): Promise<Collection<T>>;
}
