export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static unauthorizedError() {
    return new ApiError(401, "Пользователь не авторизован");
  }

  static badRequest(message: string, errors = []) {
    return new ApiError(400, message, errors);
  }

  static noEnoughRights() {
    return new ApiError(403, "Недостаточно прав");
  }
}
