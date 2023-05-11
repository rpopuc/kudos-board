import Password from "@/domains/shared/valueObjects/Password";
import { randomUUID } from "crypto";

class Panel {
  public title: string;
  public slug: string;
  public owner: string;
  public createdAt: string;
  public password: Password;
  public clientPassword: Password | null;

  constructor(data: any) {
    this.slug = randomUUID();
    this.title = data.title;
    this.owner = data.owner;
    this.createdAt = data.createdAt;
    this.password = new Password(data.password);
    this.clientPassword = data.clientPassword ? new Password(data.clientPassword) : null;
  }
}

export default Panel;
