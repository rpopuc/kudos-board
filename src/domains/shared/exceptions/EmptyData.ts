class EmptyData extends Error {
  public readonly status: string;

  constructor(status: string, dataName: string, message: string | null = null) {
    super(message ? message : `Does not have ${dataName}`);

    this.status = status;
  }
}

export default EmptyData;
