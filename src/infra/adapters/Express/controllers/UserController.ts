import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import CreateUser from "@/domain/User/UseCases/CreateUser";
import Password from "@/infra/shared/ValueObjects/BCryptPassword";
import UserPresenter from "@/domain/User/Presenters/UserPresenter";

class UserController {
  constructor(private createUserUseCase: CreateUser, private presenter: UserPresenter) {}

  store(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      data.password = new Password(data.password);
      const response = await this.createUserUseCase.handle(data);

      if (response.ok && response.data !== null) {
        res.json(this.presenter.single(response.data));
      } else {
        res.status(400).json({
          errors: response.errors.map(error => error.message),
        });
      }
    });
  }
}

export default UserController;
