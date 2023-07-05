import { Collection as MongoCollection, OptionalId, Document } from "mongodb";

export class Collection<T extends OptionalId<Document>> {
  constructor(private collection: MongoCollection) {}

  async find(filter: any): Promise<T[]> {
    return (await this.collection.find(filter).toArray()) as T[];
  }

  async insertOne(data: T): Promise<T> {
    await this.collection.insertOne(data);

    return data;
  }
}
