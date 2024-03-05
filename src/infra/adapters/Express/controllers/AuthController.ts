import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import LoginUseCase from "@/domain/Auth/UseCases/Login";

export default class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  login(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      const response = await this.loginUseCase.handle(data);

      if (response.ok) {
        res.status(201).json({ok: response.ok});
      } else {
        res
          .json({errors: response.errors.map(error => error.message)})
          .status(400);
      }
    });
  }
}
