import { Request, Response } from "express";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";
import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
import ShowKudos from "@/domain/Kudos/UseCases/ShowKudos";
import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
import ListKudos from "@/domain/Kudos/UseCases/ListKudos";

class KudosController {
  constructor(
    private createKudosUseCase: CreateKudos,
    private deleteKudosUseCase: DeleteKudos,
    private updateKudosUseCase: UpdateKudos,
    private showKudosUseCase: ShowKudos,
    private archiveKudosUseCase: ArchiveKudos,
    private listKudosUseCase: ListKudos,
    private presenter: KudosPresenter,
  ) {}

  store(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      data.owner = req.headers["user-id"] as string;

      const response = await this.createKudosUseCase.handle(data);

      if (response.ok && response.data !== null) {
        res.json(this.presenter.single(response.data));
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

  update(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const kudosSlug = req.params.slug;
      const userId = req.body.userId;
      const data = req.body;

      const response = await this.updateKudosUseCase.handle({ kudosSlug, userId, updateKudosData: data });

      if (response.ok && response.data !== null) {
        res.json(this.presenter.single(response.data));
      } else {
        res
          .json({
            errors: response.errors.map(error => error.message),
          })
          .status(400);
      }
    });
  }

  show(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const response = await this.showKudosUseCase.handle({
        slug: req.params.slug,
      });

      if (response.ok && response.data !== null) {
        res.json(this.presenter.single(response.data));
      } else {
        res
          .json({
            errors: response.errors.map(error => error.message),
          })
          .status(400);
      }
    });
  }

  archive(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const slug = req.params.id;
      const userId = req.body.userId;

      const archiveKudosResponse = await this.archiveKudosUseCase.handle({ slug, userId });

      if (archiveKudosResponse.ok) {
        res.status(200).json({ message: "Kudos archived successfully" });
      } else {
        res.status(400).json({ errors: archiveKudosResponse.errors.map(error => error.message) });
      }
    });
  }

  list(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const response = await this.listKudosUseCase.handle({
        panelSlug: req.params.panelSlug,
      });

      if (response.ok && response.data !== null) {
        res.json(this.presenter.many(response.data));
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
