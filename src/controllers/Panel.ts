import { Request, Response } from "express";

import CreatePanel from "../domains/useCases/CreatePanel";

class Panel {
  useCase: CreatePanel

  constructor(useCase: CreatePanel) {
    this.useCase = useCase;
  }

  index(req: Request, res: Response) {
    res.send("Panel::index");
  }

  store(req: Request, res: Response) {
    const panel = this.useCase.handle(req.body)

    res.send(`POST request to the Panel::${panel.slug}`)
  }
}

export default Panel;
