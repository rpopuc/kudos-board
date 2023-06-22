import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import CreatePanel from "@/domain/Panel/UseCases/CreatePanel";
import DeletePanel from "@/domain/Panel/UseCases/DeletePanel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelPresenter from "@/domain/Panel/Presenters/PanelPresenter";
import UpdatePanel from "@/domain/Panel/UseCases/UpdatePanel";
import ShowPanel from "@/domain/Panel/UseCases/ShowPanel";
import ArchivePanel from "@/domain/Panel/UseCases/ArchivePanel";

class PanelController {
  constructor(
    private createPanelUseCase: CreatePanel,
    private deletePanelUseCase: DeletePanel,
    private updatePanelUseCase: UpdatePanel,
    private showPanelUseCase: ShowPanel,
    private archivePanelUseCase: ArchivePanel,
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
      const panelSlug = req.params.slug;
      const userId = req.body.userId;

      const deletePanelResponse = await this.deletePanelUseCase.handle({ panelSlug, userId });

      if (deletePanelResponse.ok) {
        res.status(200).json({ message: "Panel deleted successfully" });
      } else {
        res.status(400).json({ message: deletePanelResponse.errors.map(error => error.message).join("\n") });
      }
    });
  }

  archive(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const panelId = req.params.id;
      const userId = req.body.userId;

      const archivePanelResponse = await this.archivePanelUseCase.handle({ panelSlug: panelId, userId });

      if (archivePanelResponse.ok) {
        res.status(200).json({ message: "Panel archived successfully" });
      } else {
        res.status(400).json({ errors: archivePanelResponse.errors.map(error => error.message) });
      }
    });
  }
}

export default PanelController;
