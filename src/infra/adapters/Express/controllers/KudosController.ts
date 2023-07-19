import { Request, Response } from "express";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";

class KudosController {
  constructor(
    private createKudosUseCase: CreateKudos,
    private deleteKudosUseCase: DeleteKudos,
    private presenter: KudosPresenter,
  ) {}

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

  delete(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const slug = req.params.slug;
      const userId = req.body.userId;

      const deleteResponse = await this.deleteKudosUseCase.handle({ slug, userId });

      if (deleteResponse.ok) {
        res.status(200).json({ message: "Kudos deleted successfully" });
      } else {
        res.status(400).json({ message: deleteResponse.errors.map(error => error.message).join("\n") });
      }
    });
  }
}

export default KudosController;
