import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import ShowKudosResponse from "@/domain/shared/Responses/ShowDataResponse";
import ShowKudosErrorResponse from "@/domain/shared/Responses/ShowErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import Kudos from "@/domain/Kudos/Entities/Kudos";

export type ShowKudosData = {
  slug: string;
};

class ShowKudos {
  constructor(private repository: Repository) {}

  async handle({ slug }: ShowKudosData): Promise<ShowKudosResponse<Kudos>> {
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
