const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let errors = {};
    let message = "An unexpected error occurred";
  
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Validation failed";
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
    } else if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format";
      errors[err.path] = `Invalid ${err.path}: ${err.value}`;
    } else if (err.code && err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue)[0];
      message = `${field} must be unique`;
      errors[field] = `${field} already exists`;
    } else if (err.message && typeof err.message === "string") {
      message = err.message;
      errors.general = err.message;
    }
  
    res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  };
  
  export default errorHandler;
  