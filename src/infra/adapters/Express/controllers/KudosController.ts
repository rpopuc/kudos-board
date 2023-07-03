import { Request, Response } from "express";
import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import Game from "@/infra/MongoDB/models/game";
import { Database } from "@/infra/MongoDB/services/Database";

class KudosController {
  index(req: Request, res: Response) {
    res.send("KudosController::index");
  }

  db(): RequestHandler {
    return asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const db = new Database();
      const gamesCollection = await db.getCollection<Game>("games");

      // Inserção
      // const newGame = {
      //   name: "Final",
      //   price: 19.96,
      //   category: "JRPG",
      // } as Game;
      // await gamesCollection.insertOne(newGame);

      // Consulta
      const games = await gamesCollection.find({});
      res.send(JSON.stringify(games));
    });
  }
}

export default KudosController;
