import { Request, Response } from "express";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import Game from "@/infra/MongoDB/models/game";
import { collections } from "@/infra/MongoDB/services/database.service";

class KudosController {
  index(req: Request, res: Response) {
    res.send("KudosController::index");
  }

  db(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      // res.send(JSON.stringify({ok: true}));
      const newGame = {
        name: "teste",
        price: 10.96,
        category: "Action",
      } as Game;

      // await collections.games?.insertOne(newGame);
      const games = (await collections.games?.find({}).toArray()) as unknown as Game[];
      res.send(JSON.stringify(games));
    });
  }
}

export default KudosController;
