import KudosEntity from "@/domain/Kudos/Entities/Kudos";
import KudosData from "@/domain/Kudos/DTO/KudosData";

export type UpdateData = {
  slug: string;
  kudosData: KudosData;
};

interface KudosRepository {
  create(kudosData: KudosData): KudosEntity;

  update(data: UpdateData): KudosEntity | null;

  delete(slug: string): boolean;

  archive(slug: string): boolean;

  findBySlug(slug: string): KudosEntity | null;
}

export default KudosRepository;
