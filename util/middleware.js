const errorHandler = (error, req, res, next) => {
  console.log("----------Entered errorHandler----------");
  console.error("Here is the error", error);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).send({ error: "malformatted data" });
  }

  next(error);
};

module.exports = {
  errorHandler,
};
