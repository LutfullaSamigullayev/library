module.exports = class CustomErrorHandler extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
  static BadRequest(message, errors = []) {
    return new CustomErrorHandler(400, message, (errors));
  }
  static UnAuthorized(message, errors = []) {
    return new CustomErrorHandler(401, message, (errors));
  }
  static Forbidden(message, errors = []) {
    return new CustomErrorHandler(403, message, (errors));
  }
  static NotFound(message, errors = []) {
    return new CustomErrorHandler(404, message, (errors));
  }
};
