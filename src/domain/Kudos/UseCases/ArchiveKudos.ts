import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import ArchiveKudosResponse from "@/domain/shared/Responses/ArchiveDataResponse";
import ArchiveKudosErrorResponse from "@/domain/shared/Responses/ArchiveErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import Kudos from "@/domain/Kudos/Entities/Kudos";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import PanelRepository from "@/domain/Panel/Repositories/PanelRepository";

export type ArchiveKudosData = {
  slug: string;
  userId: string;
};

class ArchiveKudos {
  constructor(private repository: Repository, private panelRepository: PanelRepository) {}

  async validateOwnership(kudos: Kudos, userId: string): Promise<ArchiveKudosErrorResponse | null> {
    if (kudos.from.id === userId) {
      return null;
    }

    const panel = await this.panelRepository.findBySlug(kudos.panelSlug);

    if (panel?.owner === userId) {
      return null;
    }

    return new ArchiveKudosErrorResponse([
      new BusinessError("NOT_AUTHORIZED", "You can not archive a kudos that is not yours."),
    ]);
  }

  async handle({ slug, userId }: ArchiveKudosData): Promise<ArchiveKudosResponse> {
    const kudos = await this.repository.findBySlug(slug);

    if (!kudos) {
      return new ArchiveKudosErrorResponse([
        new BusinessError("KUDOS_NOT_FOUND", "You can not archive a kudos that does not exist."),
      ]);
    }

    const ownershipValidation = await this.validateOwnership(kudos, userId);

    if (ownershipValidation !== null) {
      return ownershipValidation;
    }

    const operationResult = await this.repository.archive(slug);

    if (!operationResult) {
      return new ArchiveKudosErrorResponse([
        new BusinessError("KUDOS_NOT_ARCHIVED", "Internal error while archiving the kudos."),
      ]);
    }

    return new ArchiveKudosResponse(operationResult);
  }
}

export default ArchiveKudos;
