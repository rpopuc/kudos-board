import Password from "@/domain/shared/valueObjects/Password";
import { randomUUID } from "crypto";

export enum Status {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

class Panel {
  public title: string;
  public slug: string;
  public owner: string;
  public createdAt: Date;
  public updatedAt: Date;
  public password: Password;
  public clientPassword: Password | null;
  public status: string;

  constructor(data: any) {
    this.slug = randomUUID();
    this.title = data.title;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.password = data.password;
    this.clientPassword = data.clientPassword;
    this.status = data.status || Status.ACTIVE;
  }
}

export default Panel;
