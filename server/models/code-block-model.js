const mongoose = require("mongoose");

const codeBlockSchema = mongoose.Schema({
  title: { type: String, trim: true },
  code: { type: String },
  solution: { type: String },
});

const CodeBlock = mongoose.model("CodeBlock", codeBlockSchema);
module.exports = CodeBlock;
