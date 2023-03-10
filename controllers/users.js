const bcrypt = require("bcrypt");
const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  let where = {};

  if (req.query.read) {
    if (req.query.read === "true") {
      where = {
        read: true,
      };
    } else if (req.query.read === "false") {
      where = {
        read: false,
      };
    }
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ["userId"] },
      },
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["id", "read"],
          where,
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    username,
    name,
    passwordHash,
  });
  res.json(user);
});

router.put("/:username", async (req, res) => {
  const username = req.params.username;
  const newUsername = req.body.username;
  const user = await User.findOne({
    where: {
      username,
    },
  });

  if (user) {
    user.username = newUsername;
    await user.save();
    res.json({ username: user.username });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
