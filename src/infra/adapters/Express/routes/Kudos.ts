import express from "express";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";

class Kudos {
  static setup(app: express.Application) {
    const controller = new KudosController();

    app.get("/Kudos", controller.index);
  }
}

export default Kudos;
