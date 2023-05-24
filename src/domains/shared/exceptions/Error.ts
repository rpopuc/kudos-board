class Error {
  public readonly message: string;
  public readonly status: string;

  constructor(status: string, message: string) {
    this.message = message;
    this.status = status;
  }
}

export default Error;
