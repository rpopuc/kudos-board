import PanelEntity from "@/domains/Panel/Entities/Panel";
import PanelData from "@/domains/Panel/DTO/PanelData";

interface PanelRepository {
  create(panelData: PanelData): PanelEntity;

  findBySlug(slug: string): PanelEntity | undefined;
}

export default PanelRepository;
