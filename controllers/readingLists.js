const router = require("express").Router();

const { ReadingList } = require("../models");

router.post("/", async (req, res) => {
  await ReadingList.create(req.body);
  res.status(201).end();
});

router.put("/:id", async (req, res) => {
  if (req.decodedToken === null) {
    return res.status(401).json({ error: "token missing" });
  }

  const readingList = await ReadingList.findByPk(req.params.id);
  if (readingList) {
    if (req.decodedToken.id !== readingList.userId) {
      return res
        .status(401)
        .json({ error: "Reading lists can only be edited by their owner" });
    }
    readingList.read = req.body.read;
    await readingList.save();
    res.status(204).end();
  }
});

module.exports = router;
