import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import CreatePanel from "@/domains/Panel/UseCases/CreatePanel";

class Panel {
  constructor(private useCase: CreatePanel) {}

  index(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      res.send(`Panel::index${req.params.slug}`);
    });
  }

  store(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const panel = await this.useCase.handle(req.body);

      res.json(panel);
    });
  }
}

export default Panel;
