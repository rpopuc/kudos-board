import { Request, Response } from "express";

import CreatePanel from "../domains/useCases/CreatePanel";

class Panel {
  index(req: Request, res: Response) {
    res.send("Panel::index");
  }

  store(req: Request, res: Response) {
    const useCase = new CreatePanel()

    const panel = useCase.handle(req.body)

    res.send(`POST request to the Panel::${panel.slug}`)
  }
}

export default Panel;
