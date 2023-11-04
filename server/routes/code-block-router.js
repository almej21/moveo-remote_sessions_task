const express = require("express");
const router = express.Router();
const CodeBlock = require("../models/code-block-model");

// add new code block.
router.post("/new", async (req, res) => {
  const codeBlock = new CodeBlock({
    title: req.body.title,
    code: req.body.code,
    solution: req.body.solution,
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
  console.log("get all code blocks request");
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

//get one code block.
router.get("", async (req, res) => {
  const id = req.query.targetId;

  try {
    const codeBlock = await CodeBlock.findOne({ _id: id }).lean();
    if (!codeBlock) {
      res.status(404).json({ message: "no code block found" });
      return;
    }

    res.status(200).json(codeBlock);
    return;
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: err });
  }
});

router.put("/update", async (req, res) => {
  console.log("save code block request");

  const { codeBlockId, code } = req.body;

  const updatedCodeBlock = await CodeBlock.findByIdAndUpdate(codeBlockId, {
    code: code,
  });

  if (!updatedCodeBlock) {
    res.status(404);
    throw new Error("CodeBlock Not Found");
  } else {
    res.json({ message: "CodeBlock was updated" });
  }
});

module.exports = router;
