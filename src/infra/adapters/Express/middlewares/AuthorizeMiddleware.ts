import { Request, Response, NextFunction } from "express";
import JwtService from '@/infra/Authentication/JWT/JWTService';

const jwtService = new JwtService();

export interface AuthenticatedRequest extends Request {
  authorizedUserId?: string; // Definindo userId como opcional para evitar erro de tipo
}

export default async function authorizeMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization?.split(' ')[0];
    const token = req.headers.authorization?.split(' ')[1];

    if (bearer !== 'Bearer') {
      // throw new UnauthorizedError('UNAUTHORIZED', 'Token JWT não fornecido');
      // TODO: criar erro personalizado
      throw new Error('Acesso não autorizado');
    }

    if (token == null) {
      // TODO: criar erro personalizado
      throw new Error('Acesso não autorizado');
    }

    // TODO: criar um tipo para o token
    const decodedToken = await jwtService.verify(token) as { id: string, email: string, role: string };

    // Adicione os dados autorizados à solicitação, se necessário
    req.authorizedUserId = decodedToken.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }
}