import * as mongoDB from "mongodb";

export class Collection<T> {
  constructor(private collection: mongoDB.Collection) {}

  async find(filter: any): Promise<T[]> {
    return (await this.collection.find(filter).toArray()) as T[];
  }
}
