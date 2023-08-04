import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import ListKudosReponse from "@/domain/shared/Responses/ListDataResponse";
import Kudos from "@/domain/Kudos/Entities/Kudos";

export type ListKudosData = {
  panelSlug: string;
};

class ListKudos {
  constructor(private repository: Repository) {}

  async handle({ panelSlug }: ListKudosData): Promise<ListKudosReponse<Kudos>> {
    const kudos = await this.repository.findByPanelSlug(panelSlug);

    return new ListKudosReponse(true, kudos);
  }
}

export default ListKudos;
