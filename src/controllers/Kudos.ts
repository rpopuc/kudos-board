import { Request, Response } from "express";

class Kudos {
  index(req: Request, res: Response) {
    res.send("Kudos::index");
  }
}

export default Kudos;
