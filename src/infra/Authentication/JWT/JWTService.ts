import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import JWTServiceContract from "@/domain/Services/JWTService";
import dotenv from "dotenv";

dotenv.config();

@injectable()
export default class JWTService implements JWTServiceContract {
  public constructor(
    private secretKey: string = process.env.JWT_SECRET_KEY || "secret",
    private expirationInSeconds: number = Number(process.env.JWT_TTL) || 3600,
  ) {}

  public async sign(payload: any): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expirationInSeconds });
  }

  public async verify(token: string): Promise<any> {
    return jwt.verify(token, this.secretKey);
  }
}
