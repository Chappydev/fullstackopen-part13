const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const User = require("../models/user");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: {
      username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  const tokenUser = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(tokenUser, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = router;
