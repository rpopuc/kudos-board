import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import ShowKudosResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosResponse";
import ShowKudosErrorResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";

export type ShowKudosData = {
  slug: string;
};

class ShowKudos {
  constructor(private repository: Repository) {}

  async handle({ slug }: ShowKudosData): Promise<ShowKudosResponse> {
    const kudos = await this.repository.findBySlug(slug);

    if (!kudos) {
      return new ShowKudosErrorResponse([
        new BusinessError("KUDOS_NOT_FOUND", "Could not found a kudos with the provided ID."),
      ]);
    }

    return new ShowKudosResponse(true, kudos);
  }
}

export default ShowKudos;
