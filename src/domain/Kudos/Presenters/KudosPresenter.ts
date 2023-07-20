import Kudos, { From } from "@/domain/Kudos/Entities/Kudos";

export type KudosPresentation = {
  from: string;
  to: string;
  title: string;
  description: string;
  slug: string;
  createdAt: Date;
};

class KudosPresenter {
  single(kudos: Kudos): KudosPresentation {
    const { from, to, title, description, slug, createdAt } = kudos;

    return { from: from.name, to, title, description, slug, createdAt };
  }
}

export default KudosPresenter;
