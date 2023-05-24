import Error from "./Error";

class EmptyData extends Error {
  constructor(status: string, dataName: string, message: string | null = null) {
    super(status, message ? message : `Does not have ${dataName}`);
  }
}

export default EmptyData;
