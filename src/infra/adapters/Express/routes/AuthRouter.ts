import express from "express";
import { Container } from "inversify";
import LoginUseCase from "@/domain/Auth/UseCases/Login";
import AuthController from "@/infra/adapters/Express/controllers/AuthController";

export default class AuthRouter {
  static setup(app: express.Application, container: Container) {
    const loginUseCase = container.resolve<LoginUseCase>(LoginUseCase);
    const controller = new AuthController(loginUseCase);

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     tags: [Auth]
     *     summary: Autentica um usuário.
     *     description: Autentica um usuário.
     *     requestBody:
     *       required: true
     *       content:
     *          application/json:
     *             schema:
     *                $ref: '#/components/schemas/UserRequest'
     *     responses:
     *       201:
     *         description: Usuário registrado com sucesso.
     *         content:
     *            application/json:
     *               schema:
     *                  $ref: '#/components/schemas/UserResponse'
     *       500:
     *         description: Erro interno.
     */
    app.post("/auth/login", controller.login());
  }
}
