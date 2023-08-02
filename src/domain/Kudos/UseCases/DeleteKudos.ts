import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import DeleteKudosResponse from "@/domain/shared/Responses/DeleteDataResponse";
import DeleteKudosErrorResponse from "@/domain/shared/Responses/DeleteErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import Kudos from "@/domain/Kudos/Entities/Kudos";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";

export type DeleteKudosData = {
  slug: string;
  userId: string;
};

class DeleteKudos {
  constructor(private repository: Repository, private panelRepository: PanelRepository) {}

  async validateOwnership(kudos: Kudos, userId: string): Promise<DeleteKudosErrorResponse | null> {
    if (kudos.from.id === userId) {
      return null;
    }

    const panel = await this.panelRepository.findBySlug(kudos.panelSlug);

    if (panel?.owner === userId) {
      return null;
    }

    return new DeleteKudosErrorResponse([
      new BusinessError("NOT_AUTHORIZED", "You can not delete a kudos that is not yours."),
    ]);
  }

  async handle({ slug, userId }: DeleteKudosData): Promise<DeleteKudosResponse> {
    const kudos = await this.repository.findBySlug(slug);

    if (!kudos) {
      return new DeleteKudosResponse(true);
    }

    const ownershipValidation = await this.validateOwnership(kudos, userId);

    if (ownershipValidation !== null) {
      return ownershipValidation;
    }

    const operationResult = await this.repository.delete(slug);

    if (!operationResult) {
      return new DeleteKudosErrorResponse([
        new BusinessError("KUDOS_NOT_DELETED", "Internal error while deleting the kudos."),
      ]);
    }

    return new DeleteKudosResponse(operationResult);
  }
}

export default DeleteKudos;
