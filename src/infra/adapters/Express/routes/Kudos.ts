import express from "express";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";

class Kudos {
  static setup(app: express.Application) {
    const controller = new KudosController();

    app.get("/kudos", controller.index);
    app.get("/db", controller.db());
  }
}

export default Kudos;
