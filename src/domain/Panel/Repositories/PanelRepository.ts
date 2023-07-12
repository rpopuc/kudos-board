import PanelEntity from "@/domain/Panel/Entities/Panel";
import PanelData from "@/domain/Panel/DTO/PanelData";

export type UpdateData = {
  slug: string;
  panelData: PanelData;
};

interface PanelRepository {
  create(panelData: PanelData): Promise<PanelEntity>;

  update(data: UpdateData): Promise<PanelEntity | null>;

  delete(slug: string): Promise<boolean>;

  archive(slug: string): Promise<boolean>;

  findBySlug(slug: string): Promise<PanelEntity | null>;
}

export default PanelRepository;
