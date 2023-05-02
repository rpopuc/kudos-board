import { Request, Response } from "express";

import CreatePanel from "../domains/Panel/UseCases/CreatePanel";

class Panel {
  constructor(private useCase: CreatePanel) {}

  index(): (req: Request, res: Response) => void {
    return (req: Request, res: Response): void => {
      res.send(`Panel::index${req.params.slug}`);
    };
  }

  store(): (req: Request, res: Response) => void {
    return (req: Request, res: Response): void => {
      const panel = this.useCase.handle(req.body);

      res.send(`POST request to the Panel::${panel.slug}`);
    };
  }
}

export default Panel;
