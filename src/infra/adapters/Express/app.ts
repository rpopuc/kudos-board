import express from "express";
import PanelRouter from "@/infra/adapters/Express/routes/Panel";
import KudosRouter from "@/infra/adapters/Express/routes/Kudos";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kudos Board',
      version: '1.0.0',
      description: 'API Kudos Board',
    },
    servers: [
        {
          url: '/',
          description: 'Base URL'
        }
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
    }
  },
  apis: [
    './src/infra/adapters/Express/routes/*.ts',
    './src/infra/adapters/Express/routes/definitions/*.yaml'
  ],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

const app = express();

app.use(express.json())
  .use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

PanelRouter.setup(app);
KudosRouter.setup(app);

export default app;
