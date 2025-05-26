const express = require("express");
const router = express.Router();
const { getBeat, getBeats, getLicense } = require("../controllers/admin");
router.route("/beat").get(getBeats);
router.route("/beat/:id").get(getBeat);
router.route("/license").get(getLicense);
module.exports = router;