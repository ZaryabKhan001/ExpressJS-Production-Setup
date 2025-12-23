export abstract class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly success: boolean;

  protected constructor(
    message: string,
    statusCode: number,
    success = false,
    isOperational = true,
  ) {
    super(message);

    this.success = success;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
