import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

export default class ApiDocsRouter {
  static setup(app: express.Application): void {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Kudos Board",
          version: "1.0.0",
          description: "API Kudos Board",
        },
        servers: [
          {
            url: "/",
            description: "Base URL",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
      apis: ["./src/infra/adapters/Express/routes/*.ts", "./src/infra/adapters/Express/routes/schemas/*.yaml"],
    };
    const swaggerDocs = swaggerJSDoc(swaggerOptions);

    app.use(express.json()).use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.get("/docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(swaggerDocs));
    });
  }
}
