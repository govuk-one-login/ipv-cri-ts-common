export class CriError extends Error {
  public readonly statusCode: number;
  public readonly internalCode: string;

  constructor(statusCode: number, message: string, internalCode?: string) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.internalCode = internalCode ?? "CRI_ERROR";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
