import { Collection as MongoCollection, OptionalId, Document, ObjectId } from "mongodb";

export class Collection<T extends OptionalId<Document>> {
  constructor(private collection: MongoCollection) {}

  async find(filter: any): Promise<T[]> {
    return (await this.collection.find(filter).toArray()) as T[];
  }

  async findFirst(filter: any): Promise<T | null> {
    const documents = await this.find(filter);
    return documents[0];
  }

  async insertOne(data: T): Promise<T> {
    await this.collection.insertOne(data);

    return data;
  }

  async update(id: ObjectId, data: T): Promise<T> {
    await this.collection.updateOne(
      {
        _id: id,
      },
      {
        $set: data,
      },
    );

    return data;
  }

  async delete(id: ObjectId): Promise<boolean> {
    return (await this.collection.deleteOne({ _id: id })).acknowledged;
  }
}
