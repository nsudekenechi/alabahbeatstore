const express = require("express");
const router = express.Router();
const { getBeat, getBeats, getLicense, getLicenses } = require("../controllers/admin");
const { authenticate } = require("../middlewares/auth");
const { addToCart, getCart, deleteCartItem } = require("../controllers/user");

// public
router.route("/beat").get(getBeats);
router.route("/beat/:id").get(getBeat);
router.route("/license").get(getLicenses);
router.route("/license/:id").get(getLicense);

// protected
router.route("/cart").all(authenticate).post(addToCart).get(getCart)
router.route("/cart/:id").all(authenticate).delete(deleteCartItem);
module.exports = router;