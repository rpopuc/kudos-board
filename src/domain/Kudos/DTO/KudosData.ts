import { From } from "@/domain/Kudos/Entities/Kudos";

interface KudosData {
  panelSlug: string;
  slug?: string;
  title: string;
  description: string;
  from: From;
  to: string;
  createdAt?: Date;
}

export default KudosData;
