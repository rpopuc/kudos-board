import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";
import PlainTextPassword from "@/infra/shared/ValueObjects/PlainTextPassword";
import PanelPresenter from "@/domains/shared/presenters/PanelPresenter";

class Panel {
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

      const panel = await this.useCase.handle(data);

      const presenter = new PanelPresenter();

      res.json(presenter.single(panel));
    });
  }
}

export default Panel;
