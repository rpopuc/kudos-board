import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelPresenter from "@/domains/shared/presenters/PanelPresenter";

class PanelController {
  constructor(private useCase: CreatePanel) {}

  index(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      res.send(`Panel::index${req.params.slug}`);
    });
  }

  store(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const data = req.body;
      data.password = new PlainTextPassword(data.password);

      const response = await this.useCase.handle(data);
      const presenter = new PanelPresenter();

      if (response.ok && response.panel !== null) {
        res.json(presenter.single(response.panel));
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

export default PanelController;
