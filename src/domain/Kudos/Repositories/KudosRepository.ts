import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import KudosData from "@/domain/Kudos/DTO/KudosData";

export type UpdateData = {
  slug: string;
  kudosData: KudosData;
};

interface KudosRepository {
  create(kudosData: KudosData): Promise<KudosEntity>;

  update(data: UpdateData): Promise<KudosEntity | null>;

  delete(slug: string): Promise<boolean>;

  archive(slug: string): Promise<boolean>;

  findBySlug(slug: string): Promise<KudosEntity | null>;
}

export default KudosRepository;
