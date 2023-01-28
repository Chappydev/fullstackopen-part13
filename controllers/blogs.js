const router = require("express").Router();

const { Blog, User } = require("../models");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  if (req.decodedToken === null) {
    return res.status(401).json({ error: "token missing" });
  }
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  return res.json(blog);
});

router.delete("/:id", async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  console.log("req.blog", req.blog);
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json({ likes: req.body.likes });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
