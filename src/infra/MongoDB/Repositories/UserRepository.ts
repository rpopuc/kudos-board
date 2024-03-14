import { injectable, inject } from "inversify";
import "reflect-metadata";

import UserEntity from "@/domain/User/Entities/User";
import UserRepositoryInterface from "@/domain/User/Repositories/UserRepository";
import UserData from "@/domain/User/DTO/UserData";
import { User as UserDocument } from "@/infra/MongoDB/models/User";
import { DatabaseInterface, DatabaseInterfaceType } from "@/infra/MongoDB/services/DatabaseInterface";
import BCryptPassword from "@/infra/shared/ValueObjects/BCryptPassword";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

@injectable()
class UserRepository implements UserRepositoryInterface {
  collectionName = "users";

  constructor(@inject(DatabaseInterfaceType) private db: DatabaseInterface) {}

  async create(userData: UserData): Promise<UserEntity> {
    const user: UserDocument = {
      email: userData.email,
      name: userData.name,
      password: userData.password.getValue(),
    };

    await this.db.connect();
    const collection = await this.db.getCollection<UserDocument>(this.collectionName);
    const userDocument = await collection.insertOne(user);

    if (!userDocument._id) {
      throw new Error("Error creating user on database");
    }

    return new UserEntity({
      ...userDocument,
      id: userDocument._id,
    });
  }

  async find(email: string): Promise<UserEntity | null> {
    await this.db.connect();
    const collection = await this.db.getCollection<UserDocument>(this.collectionName);
    const document = await collection.findFirst({ email } as UserDocument);

    if (!document) {
      return null;
    }

    return new UserEntity({
      ...document,
      id: document._id,
      password: BCryptPassword.fromHashedValue(document.password),
    });
  }
}

export default UserRepository;
