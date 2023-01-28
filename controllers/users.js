const bcrypt = require("bcrypt");
const router = require("express").Router();

const { User } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
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
