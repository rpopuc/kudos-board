import PanelEntity from "@/domain/Panel/Entities/Panel";
import PanelData from "@/domain/Panel/DTO/PanelData";

export type UpdateData = {
  slug: string;
  panelData: PanelData;
};

interface PanelRepository {
  create(panelData: PanelData): PanelEntity;

  update(data: UpdateData): PanelEntity | null;

  delete(slug: string): boolean;

  archive(slug: string): boolean;

  findBySlug(slug: string): PanelEntity | null;
}

export default PanelRepository;
