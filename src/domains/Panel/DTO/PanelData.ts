import Password from "@/domains/shared/valueObjects/Password";

interface PanelData {
  title: string;
  slug?: string;
  owner: string;
  createdAt?: Date;
  password: Password;
  clientPassword?: Password;
}

export default PanelData;
