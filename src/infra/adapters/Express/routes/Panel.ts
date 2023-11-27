import express from "express";
import PanelController from "@/infra/adapters/Express/controllers/PanelController";

import { Container } from "@/infra/inversify.config";
import { TYPES } from "@/infra/types";
import CreatePanel from "@/domain/Panel/UseCases/CreatePanel";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import DeletePanel from "@/domain/Panel/UseCases/DeletePanel";
import UpdatePanel from "@/domain/Panel/UseCases/UpdatePanel";
import ShowPanel from "@/domain/Panel/UseCases/ShowPanel";
import PanelPresenter from "@/domain/Panel/Presenters/PanelPresenter";
import ArchivePanel from "@/domain/Panel/UseCases/ArchivePanel";

class Panel {
  static setup(app: express.Application) {
    const repository = Container.get<PanelRepositoryInterface>(TYPES.PanelRepository);

    const createPanelUseCase = new CreatePanel(repository);
    const deletePanelUseCase = new DeletePanel(repository);
    const archivePanelUseCase = new ArchivePanel(repository);
    const updatePanelUseCase = new UpdatePanel(repository);
    const showPanelUseCase = new ShowPanel(repository);
    const presenter = new PanelPresenter();

    const controller = new PanelController(
      createPanelUseCase,
      deletePanelUseCase,
      updatePanelUseCase,
      showPanelUseCase,
      archivePanelUseCase,
      presenter,
    );

    /**
     * @swagger
     * /panel:
     *   post:
     *     tags: [Panel]
     *     summary: Adiciona um novo painel.
     *     description: Adiciona um novo painel.
     *     requestBody:
     *       required: true
     *       content:
     *         $ref: '#/definitions/PanelJsonRequest'
     *     responses:
     *       200:
     *         description: Painel registrado com sucesso.
     *         content:
     *            $ref: '#/definitions/PanelJsonResponse'
     *       404:
     *         $ref: '#/definitions/responses/NotFound'
     *       500:
     *         $ref: '#/definitions/responses/ServerError'
     */
    app.post("/panel", controller.store());

    /**
     * @swagger
     * /panel/archive/{slug}:
     *   put:
     *      tags: [Panel]
     *      summary: Arquiva um Painel
     *      description: Arquiva um painel
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do painel
     *          schema:
     *            type: string
     *            example: "panel-slug"
     *      responses:
     *       200:
     *         description: Painel arquivado com sucesso.
     *         content:
     *            application/json:
     *             schema:
     *                type: object
     *                properties:
     *                    message:
     *                       type: string
     *                       example: "Panel archived successfully"
     *       404:
     *         $ref: '#/definitions/responses/NotFound'
     *       500:
     *         $ref: '#/definitions/responses/ServerError'
     */
    app.put("/panel/archive/:slug", controller.archive());

    /**
     * @swagger
     * /panel/{slug}:
     *   put:
     *      tags: [Panel]
     *      summary: Atualiza os dados de um Painel.
     *      description: Atualiza os dados de um Painel.
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do painel
     *          schema:
     *            type: string
     *            example: "panel-slug"
     *      requestBody:
     *          required: true
     *          content:
     *             $ref: '#/definitions/PanelJsonUpdateRequest'
     *      responses:
     *       200:
     *         description: Painel atualizado com sucesso.
     *         content:
     *            $ref: '#/definitions/PanelJsonResponse'
     *       404:
     *         $ref: '#/definitions/responses/NotFound'
     *       500:
     *         $ref: '#/definitions/responses/ServerError'
     */
    app.put("/panel/:slug", controller.update());

    /**
     * @swagger
     * /panel/{slug}:
     *   delete:
     *      tags: [Panel]
     *      summary: Exclui um Painel
     *      description: Exlui um Painel
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do painel
     *          schema:
     *            type: string
     *            example: "painel-slug"
     *      responses:
     *       200:
     *         description: Painel excluído com sucesso.
     *         content:
     *            application/json:
     *              schema:
     *                 type: object
     *                 properties:
     *                    message:
     *                      type: string
     *                      example: "Panel deleted successfully"
     *       500:
     *         $ref: '#/definitions/responses/ServerError'
     */
    app.delete("/panel/:slug", controller.delete());

    /**
     * @swagger
     * /panel/{slug}:
     *   post:
     *      tags: [Panel]
     *      summary: Obtém os dados de um Painel
     *      description: Obtém os dados de um Painel
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do painel
     *          schema:
     *            type: string
     *            example: "panel-slug"
     *      requestBody:
     *          required: false
     *          content:
     *            application/json:
     *              schema:
     *                type: object
     *                properties:
     *                    password:
     *                      type: string
     *                      example: "Kudos panel password"
     *      responses:
     *       200:
     *         description: Dados do Kudos
     *         content:
     *            $ref: '#/definitions/PanelJsonResponse'
     *       404:
     *         $ref: '#/definitions/responses/NotFound'
     *       500:
     *         $ref: '#/definitions/responses/ServerError'
     */
    app.post("/panel/:slug", controller.show());

    /**
     * @swagger
     * /panel:
     *   get:
     *      tags: [Panel]
     *      summary: Lista os painéis do usuário
     *      description: Lista os painéis do usuário
     *      responses:
     *       200:
     *         description: Painéis do usuário
     *         content:
     *            $ref: '#/definitions/PanelListJsonResponse'
     *       404:
     *         $ref: '#/definitions/responses/NotFound'
     *       500:
     *         $ref: '#/definitions/responses/ServerError'
     */
    app.get("/panel", controller.index());
  }
}

export default Panel;
