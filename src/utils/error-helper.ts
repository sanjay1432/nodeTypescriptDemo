class AppError extends Error {
  type: "warning" | "error";

  constructor(public status: number, resError: string) {
    super(resError);
  }
}

export class ErrorResponse extends AppError {}
