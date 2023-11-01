const express = require("express");
const router = express.Router();
const CodeBlock = require("../models/code-block-model");

// add new code block.
router.post("/new", async (req, res) => {
  const codeBlock = new CodeBlock({
    title: req.body.title,
    code: req.body.code,
  });

  try {
    const newCodeBlock = await codeBlock.save();
    res.status(201).json({ new_codeBlock: newCodeBlock });
    return;
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all code blocks.
router.get("/all", async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find({}).lean();
    if (!codeBlocks) {
      res.status(404).json({ message: "no code blocks found" });
      return;
    }

    res.status(200).json(codeBlocks);
    return;
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
});

module.exports = router;
