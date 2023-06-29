import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import DeleteKudosResponse from "@/domain/Kudos/UseCases/Responses/DeleteKudosResponse";
import DeleteKudosErrorResponse from "@/domain/Kudos/UseCases/Responses/DeleteKudosErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

export type DeleteKudosData = {
  slug: string;
  userId: string;
};

class DeleteKudos {
  constructor(private repository: Repository) {}

  async handle({ slug, userId }: DeleteKudosData): Promise<DeleteKudosResponse> {
    const kudos = this.repository.findBySlug(slug);

    if (!kudos) {
      return new DeleteKudosResponse(true);
    }

    if (userId !== kudos.from.id) {
      return new DeleteKudosErrorResponse([
        new BusinessError("NOT_AUTHORIZED", "You can not delete a kudos that is not yours."),
      ]);
    }

    const operationResult = this.repository.delete(slug);

    if (!operationResult) {
      return new DeleteKudosErrorResponse([
        new BusinessError("KUDOS_NOT_DELETED", "Internal error while deleting the kudos."),
      ]);
    }

    return new DeleteKudosResponse(operationResult);
  }
}

export default DeleteKudos;
