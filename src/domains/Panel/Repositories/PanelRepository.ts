import PanelEntity from "@/domains/Panel/Entities/Panel";
import PanelData from "@/domains/Panel/DTO/PanelData";

interface PanelRepository {
  create(panelData: PanelData): PanelEntity;

  update(slug: string, panelData: PanelData): PanelEntity | null;

  findBySlug(slug: string): PanelEntity | null;
}

export default PanelRepository;
