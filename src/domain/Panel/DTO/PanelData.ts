import Password from "@/domain/shared/valueObjects/Password";

interface PanelData {
  title: string;
  slug?: string;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
  password: Password;
  clientPassword?: Password;
  status?: string;
}

export default PanelData;
