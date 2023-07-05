import { ObjectId } from "mongodb";

export class Panel {
  constructor(
    public slug: string,
    public title: string,
    public owner: string,
    public createdAt: Date,
    public updatedAt: Date,
    public password: string,
    public status: string,
    public clientPassword?: string,
    public _id?: ObjectId,
  ) {}
}
