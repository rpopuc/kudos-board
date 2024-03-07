import UserRepository, { UserRepositoryType } from "@/domain/User/Repositories/UserRepository";
import MongoUserRepository from "@/infra/MongoDB/Repositories/UserRepository";
import { Container } from "inversify";
import CreateUser from "@/domain/User/UseCases/CreateUser";
import { DatabaseInterface, DatabaseInterfaceType } from "@/infra/MongoDB/services/DatabaseInterface";
import { Database } from "@/infra/MongoDB/services/Database";
import JWTServiceInterface, { JWTServiceType } from "@/domain/Services/JWTService";
import JWTService from "@/infra/Authentication/JWT/JWTService";

export class ApplicationServiceProvider {
  public register(container: Container): void {
    this.registerUser(container);
  }

  private registerUser(container: Container): void {
    container.bind<UserRepository>(UserRepositoryType).to(MongoUserRepository);
    container.bind<CreateUser>(CreateUser).toSelf();
    container.bind<DatabaseInterface>(DatabaseInterfaceType).to(Database);
    container.bind<JWTServiceInterface>(JWTServiceType).to(JWTService);
  }
}
