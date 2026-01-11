import ApplicationError from "../error/error.applicationError.js";

const errorHandler = (err, req, res, next) => {
  // Known / Custom errors
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode,
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Unknown / System errors
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    error: err.message || "Server error! Try again later.",
    statusCode,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),

    // useful for debugging (safe fields)
    code: err.code || err.name,
    requestId: err?.$metadata?.requestId,
  });
};

export default errorHandler;
