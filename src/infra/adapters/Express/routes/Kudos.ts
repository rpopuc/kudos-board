import express from "express";
import { Container } from "@/infra/inversify.config";
import KudosRepositoryInterface from "@/domain/Kudos/Repositories/KudosRepository";
import { TYPES } from "@/infra/types";
import KudosController from "@/infra/adapters/Express/controllers/KudosController";
import CreateKudos from "@/domain/Kudos/UseCases/CreateKudos";
import DeleteKudos from "@/domain/Kudos/UseCases/DeleteKudos";
import KudosPresenter from "@/domain/Kudos/Presenters/KudosPresenter";
import UpdateKudos from "@/domain/Kudos/UseCases/UpdateKudos";
import ShowKudos from "@/domain/Kudos/UseCases/ShowKudos";
import ArchiveKudos from "@/domain/Kudos/UseCases/ArchiveKudos";
import PanelRepositoryInterface from "@/domain/Panel/Repositories/PanelRepository";
import ListKudos from "@/domain/Kudos/UseCases/ListKudos";

class Kudos {
  static setup(app: express.Application) {
    const repository = Container.get<KudosRepositoryInterface>(TYPES.KudosRepository);
    const panelRepository = Container.get<PanelRepositoryInterface>(TYPES.KudosRepository);

    const createKudosUseCase = new CreateKudos(repository);
    const deleteKudosUseCase = new DeleteKudos(repository, panelRepository);
    const updateKudosUseCase = new UpdateKudos(repository, panelRepository);
    const showKudosUseCase = new ShowKudos(repository);
    const archiveKudosUseCase = new ArchiveKudos(repository, panelRepository);
    const listKudosUseCase = new ListKudos(repository);

    const controller = new KudosController(
      createKudosUseCase,
      deleteKudosUseCase,
      updateKudosUseCase,
      showKudosUseCase,
      archiveKudosUseCase,
      listKudosUseCase,
      new KudosPresenter(),
    );

    /**
     * @swagger
     * /kudos:
     *   post:
     *     tags: [Kudos]
     *     summary: Adiciona um novo kudos.
     *     description: Adiciona um novo kudos.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *            schema:
     *              $ref: "#/components/schemas/KudosRequest"
     *     responses:
     *       200:
     *         description: Kudos registrado com sucesso.
     *         content:
     *            application/json:
     *              schema:
     *                $ref: "#/components/schemas/KudosResponse"
     *       404:
     *         description: Kudos não encontrado.
     *       500:
     *         description: Erro interno.
     */
    app.post("/kudos", controller.store());

    /**
     * @swagger
     * /kudos/archive/{slug}:
     *   put:
     *      tags: [Kudos]
     *      summary: Arquiva um Kudos
     *      description: Arquiva um kudos
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do kudos
     *          schema:
     *            type: string
     *            example: "kudos-slug"
     *      responses:
     *       200:
     *         description: Kudos arquivado com sucesso.
     *         content:
     *            application/json:
     *             schema:
     *                type: object
     *                properties:
     *                    message:
     *                       type: string
     *                       example: "Kudos archived successfully"
     *       404:
     *         description: Kudos não encontrado.
     *       500:
     *         description: Erro interno.
     */
    app.put("/kudos/archive/:slug", controller.archive());

    /**
     * @swagger
     * /kudos/{slug}:
     *   put:
     *      tags: [Kudos]
     *      summary: Atualiza os dados de um Kudos
     *      description: Atualiza os dados de um Kudos
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do kudos
     *          schema:
     *            type: string
     *            example: "kudos-slug"
     *      requestBody:
     *          required: true
     *          content:
     *            application/json:
     *              schema:
     *                 $ref: "#/components/schemas/KudosUpdateRequest"
     *      responses:
     *       200:
     *         description: Kudos atualizado com sucesso.
     *         content:
     *            application/json:
     *               schema:
     *                 $ref: "#/components/schemas/KudosResponse"
     *       404:
     *         description: Kudos não encontrado.
     *       500:
     *         description: Erro interno.
     */
    app.put("/kudos/:slug", controller.update());

    /**
     * @swagger
     * /kudos/{slug}:
     *   delete:
     *      tags: [Kudos]
     *      summary: Exclui um Kudos
     *      description: Exlui um Kudos
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do kudos
     *          schema:
     *            type: string
     *            example: "kudos-slug"
     *      responses:
     *       200:
     *         description: Kudos excluído com sucesso.
     *         content:
     *            application/json:
     *              schema:
     *                 type: object
     *                 properties:
     *                    message:
     *                      type: string
     *                      example: "Kudos deleted successfully"
     *       404:
     *         description: Kudos não encontrado.
     *       500:
     *         description: Erro interno.
     */
    app.delete("/kudos/:slug", controller.delete());

    /**
     * @swagger
     * /kudos/panel/{panelSlug}:
     *   get:
     *      tags: [Kudos]
     *      summary: Obtém a lista de kudos a partir de um panel
     *      description: Obtém os dados de um Kudos
     *      parameters:
     *        - in: path
     *          name: panelSlug
     *          required: true
     *          description: Slug do panelSlug
     *          schema:
     *            type: string
     *            example: "panel-slug"
     *      responses:
     *       200:
     *         description: Dados do Kudos
     *         content:
     *            application/json:
     *               schema:
     *                 $ref: "#/components/schemas/KudosListResponse"
     *       404:
     *         description: Kudos não encontrado.
     *       500:
     *         description: Erro interno.
     */
    app.get("/kudos/panel/:panelSlug", controller.list());

    /**
     * @swagger
     * /kudos/{slug}:
     *   post:
     *      tags: [Kudos]
     *      summary: Obtém os dados de um Kudos
     *      description: Obtém os dados de um Kudos
     *      parameters:
     *        - in: path
     *          name: slug
     *          required: true
     *          description: Slug do kudos
     *          schema:
     *            type: string
     *            example: "kudos-slug"
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
     *            application/json:
     *               schema:
     *                 $ref: "#/components/schemas/KudosResponse"
     *       404:
     *         description: Kudos não encontrado.
     *       500:
     *         description: Erro interno.
     */
    app.post("/kudos/:slug", controller.show());
  }
}

export default Kudos;
