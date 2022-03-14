function sendError(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

/**
 * Wraps an async function. Catches and passes the error raised
 * in the async function to the next error handler
 * @param {Function} fn - Async function to be wrapped
 */
function wrapAsync(fn) {
  return (req, res, next) => {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}

module.exports = {
  sendError,
  wrapAsync,
};
