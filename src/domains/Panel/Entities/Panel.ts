import Password from "@/domains/shared/valueObjects/Password";
import { randomUUID } from "crypto";

class Panel {
  public title: string;
  public slug: string;
  public owner: string;
  public createdAt: Date;
  public password: Password;
  public clientPassword: Password | null;

  constructor(data: any) {
    this.slug = randomUUID();
    this.title = data.title;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
    this.password = data.password;
    this.clientPassword = data.clientPassword;
  }
}

export default Panel;
