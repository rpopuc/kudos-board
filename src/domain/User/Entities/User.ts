import Password from "@/domain/shared/valueObjects/Password";

class User {
  public email: string;
  public name: string;
  public password: Password;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: any) {
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export default User;
