import { ObjectId } from "mongodb";

type From = {
  name: string;
  id: string;
};

export class Kudos {
  constructor(
    public slug: string,
    public panelSlug: string,
    public title: string,
    public description: string,
    public from: From,
    public to: string,
    public createdAt: Date,
    public updatedAt: Date,
    public status: string,
    public _id?: ObjectId,
  ) {}
}
