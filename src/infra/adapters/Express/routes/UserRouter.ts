import express from "express";
import { Container } from "inversify";
import CreateUserUseCase from "@/domain/User/UseCases/CreateUser";
import UserController from "@/infra/adapters/Express/controllers/UserController";
import UserPresenter from "@/domain/User/Presenters/UserPresenter";

export default class UserRouter {
  static setup(app: express.Application, container: Container) {
    const createUserUseCase = container.resolve<CreateUserUseCase>(CreateUserUseCase);
    const presenter = new UserPresenter();

    const controller = new UserController(createUserUseCase, presenter);

    /**
     * @swagger
     * /user:
     *   post:
     *     tags: [User]
     *     summary: Adiciona um novo usuário.
     *     description: Adiciona um novo usuário.
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
    app.post("/user", controller.store());
  }
}
