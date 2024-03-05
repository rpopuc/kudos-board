import { ObjectId } from "mongodb";

export type User = {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};
