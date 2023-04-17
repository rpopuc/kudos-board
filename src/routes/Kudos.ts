import express from "express";
import KudosController from "../controllers/Kudos"

class Kudos
{
  static setup(app: express.Application)
  {
    const controller = new KudosController;

    app.get("/Kudos", controller.index);
  }
}

export default Kudos;