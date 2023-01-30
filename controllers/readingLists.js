const { ReadingList } = require("../models");

const router = require("express").Router();

router.post("/", async (req, res) => {
  await ReadingList.create(req.body);
  res.status(201).end();
});

module.exports = router;
