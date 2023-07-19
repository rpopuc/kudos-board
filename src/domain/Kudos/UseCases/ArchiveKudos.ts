import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import ArchiveKudosResponse from "@/domain/Kudos/UseCases/Responses/ArchiveKudosResponse";
import ArchiveKudosErrorResponse from "@/domain/Kudos/UseCases/Responses/ArchiveKudosErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

export type ArchiveKudosData = {
  slug: string;
  userId: string;
};

class ArchiveKudos {
  constructor(private repository: Repository) {}

  async handle({ slug, userId }: ArchiveKudosData): Promise<ArchiveKudosResponse> {
    const kudos = await this.repository.findBySlug(slug);

    if (!kudos) {
      return new ArchiveKudosErrorResponse([
        new BusinessError("KUDOS_NOT_FOUND", "You can not archive a kudos that does not exist."),
      ]);
    }

    if (userId !== kudos.from.id) {
      return new ArchiveKudosErrorResponse([
        new BusinessError("NOT_AUTHORIZED", "You can not archive a kudos that is not yours."),
      ]);
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
