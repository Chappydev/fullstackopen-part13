const router = require("express").Router();

const { Op } = require("sequelize");
const { Blog, User } = require("../models");
const { blogFinder } = require("../util/middleware");

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.substring]: req.query.search } },
        { author: { [Op.substring]: req.query.search } },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
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

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.decodedToken === null) {
    return res.status(401).json({ error: "token missing" });
  }

  if (req.blog) {
    if (req.decodedToken.id !== req.blog.userId) {
      return res
        .status(401)
        .json({ error: "Blogs can only be deleted by their creator" });
    }

    await req.blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res) => {
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
