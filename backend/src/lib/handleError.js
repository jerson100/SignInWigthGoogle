const handleControllerError = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res);
      next();
    } catch (e) {
      next(e);
    }
  };
};

const handleError = (error, req, res, next) => {
  console.log("--------------------------");
  console.log(error);
  console.log("--------------------------");
  if (error.status) {
    res.status(error.status).json({
      message: error.message,
    });
  } else {
    res.status(500).json({ message: "Ocurrió un error en el servidor" });
  }
};

export { handleControllerError, handleError };
