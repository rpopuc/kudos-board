import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import DeletePanel from "@/domains/Panel/UseCases/DeletePanel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelPresenter from "@/domains/shared/presenters/PanelPresenter";
import UpdatePanel from "@/domains/Panel/UseCases/UpdatePanel";
import ShowPanel from "@/domains/Panel/UseCases/ShowPanel";

class PanelController {
  constructor(
    private createPanelUseCase: CreatePanel,
    private deletePanelUseCase: DeletePanel,
    private updatePanelUseCase: UpdatePanel,
    private showPanelUseCase: ShowPanel,
    private presenter: PanelPresenter,
  ) {}

  show(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;

      const response = await this.showPanelUseCase.handle(req.params.slug, data.clientPassword);

      if (response.ok && response.panel !== null) {
        res.json(this.presenter.single(response.panel));
      } else {
        res
          .json({
            errors: response.errors.map(error => error.message),
          })
          .status(400);
      }
    });
  }

  store(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      data.owner = req.headers["user-id"] as string;
      data.password = new PlainTextPassword(data.password);

      const response = await this.createPanelUseCase.handle(data);

      if (response.ok && response.panel !== null) {
        res.json(this.presenter.single(response.panel));
      } else {
        res
          .json({
            errors: response.errors.map(error => error.message),
          })
          .status(400);
      }
    });
  }

  update(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const panelId = req.params.id;
      const userId = req.body.userId;
      const data = req.body;

      data.password = new PlainTextPassword(data.password);

      const response = await this.updatePanelUseCase.handle(panelId, userId, data);

      if (response.ok && response.panel !== null) {
        res.json(this.presenter.single(response.panel));
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
      const panelId = req.params.id;
      const userId = req.body.userId;

      const deletePanelResponse = await this.deletePanelUseCase.handle(panelId, userId);

      if (deletePanelResponse.ok) {
        res.status(200).json({ message: "Panel deleted successfully" });
      } else {
        res.status(400).json({ message: deletePanelResponse.errors.map(error => error.message).join("\n") });
      }
    });
  }
}

export default PanelController;
