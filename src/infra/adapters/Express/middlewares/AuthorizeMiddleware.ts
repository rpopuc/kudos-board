import { Request, Response, NextFunction } from "express";
import JwtService from "@/infra/Authentication/JWT/JWTService";

const jwtService = new JwtService();

export interface AuthorizationToken {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  authorizedUserId?: string; // Definindo userId como opcional para evitar erro de tipo
}

const respondWithError = (res: Response) => {
  return res.status(401).json({ message: "Acesso não autorizado" });
};

export default async function authorizeMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization?.split(" ")[0];
    const token = req.headers.authorization?.split(" ")[1];

    if (bearer !== "Bearer" || token == null) {
      return respondWithError(res);
    }

    const decodedToken: AuthorizationToken = await jwtService.verify(token);

    // Adiciona a identificação do usuário autenticado na requisição
    req.authorizedUserId = decodedToken.id;

    next();
  } catch (error) {
    return respondWithError(res);
  }
}
