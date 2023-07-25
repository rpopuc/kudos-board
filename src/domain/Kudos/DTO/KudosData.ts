import { From } from "@/domain/Kudos/Entities/Kudos";
import { Status } from "@/domain/Kudos/Entities/Kudos";

interface KudosData {
  panelSlug: string;
  slug?: string;
  title: string;
  description: string;
  from: From;
  to: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: Status.ACTIVE | Status.ARCHIVED | null;
}

export default KudosData;
