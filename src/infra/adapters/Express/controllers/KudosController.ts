import { Request, Response } from "express";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import { Database } from "@/infra/MongoDB/services/Database";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";

class KudosController {
  constructor(private createKudosUseCase: CreateKudos, private presenter: KudosPresenter) {}

  store(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      data.owner = req.headers["user-id"] as string;

      const response = await this.createKudosUseCase.handle(data);

      if (response.ok && response.kudos !== null) {
        res.json(this.presenter.single(response.kudos));
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

export default KudosController;
