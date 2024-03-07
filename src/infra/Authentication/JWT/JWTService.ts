import { injectable, inject } from "inversify";
import jwt from 'jsonwebtoken';
import JWTServiceContract from "@/domain/Services/JWTService";

@injectable()
export default class JWTService implements JWTServiceContract
{
    // TODO: Verificar como passar o secretKey para o construtor
    private secretKey: string = 'secreto';

    public async sign(payload: any, expiresInInSeconds: number = 3600): Promise<string>
    {
        return jwt.sign(payload, this.secretKey, { expiresIn: expiresInInSeconds });
    }

    public async verify(token: string): Promise<any>
    {
        return jwt.verify(token, this.secretKey);
    }
}