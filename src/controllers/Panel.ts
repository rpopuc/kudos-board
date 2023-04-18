import { Request, Response } from "express";

class Panel {
  index(req: Request, res: Response) {
    res.send("Panel::index");
  }
}

export default Panel;
