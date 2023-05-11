class InvalidPassword extends Error {
  constructor(message: string | null = null) {
    super(message ? message : `Invalid password`);
  }
}

export default InvalidPassword;
