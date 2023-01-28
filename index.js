const express = require("express");
require("express-async-errors");
const app = express();
const { PORT } = require("./util/config");
const blogsRouter = require("./controllers/blogs");
const { connectToDatabase } = require("./util/db");
const middleware = require("./util/middleware");

app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.use(middleware.blogFinder);
app.use(middleware.errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
