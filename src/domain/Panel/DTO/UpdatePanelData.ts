import Password from "@/domain/shared/valueObjects/Password";

interface UpdatePanelData {
  title?: string;
  password?: Password;
  clientPassword?: Password;
}

export default UpdatePanelData;
