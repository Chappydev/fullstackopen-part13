const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  if (req.blog) {
    res.json(req.blogs);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const blog = await Blog.build(req.body);
    blog.save();
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

module.exports = router;
