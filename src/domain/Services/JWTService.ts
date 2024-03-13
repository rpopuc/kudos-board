export type Payload = {
  id: string;
  email: string;
  role: string;
};

export const JWTServiceType = Symbol.for("JWTService");

export default interface JWTService {
  sign(payload: Payload): Promise<string>;
  verify(token: string): Promise<boolean>;
}
