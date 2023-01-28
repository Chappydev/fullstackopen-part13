const jwt = require("jsonwebtoken");
const { Blog } = require("../models");

const errorHandler = (error, req, res, next) => {
  console.log("----------Entered errorHandler----------");
  console.error("Here is the error", error);

  if (error.name === "SequelizeValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(
        authorization.substring(7),
        process.env.SECRET
      );
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    req.decodedToken = null;
  }
  next();
};

module.exports = {
  errorHandler,
  blogFinder,
  tokenExtractor,
};
