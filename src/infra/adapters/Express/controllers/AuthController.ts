import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import LoginUseCase from "@/domain/Auth/UseCases/Login";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";

export default class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  login(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      const response = await this.loginUseCase.handle({
        email: data.email,
        password: new PlainTextPassword(data.password),
      });

      if (response.ok) {
        res.status(201).send(response.token);
      } else {
        res
          .json({
            errors: response.errors.map(error => error.message),
          })
          .status(400);
      }
    });
  }
}
