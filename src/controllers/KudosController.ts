import { Request, Response } from "express";

class KudosController {
  index(req: Request, res: Response) {
    res.send("KudosController::index");
  }
}

export default KudosController;
