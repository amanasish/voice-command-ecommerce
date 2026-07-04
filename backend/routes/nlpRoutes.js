// routes/nlpRoutes.js

const express = require("express");
const router = express.Router();

const { parseTranscript } = require("../controllers/nlpController");

// POST /nlp/parse
// Body: { transcript: "show me blue shirts under 500" }
router.post("/parse", parseTranscript);

module.exports = router;
