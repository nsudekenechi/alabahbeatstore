const express = require("express");
const router = express.Router();
const { getBeat, getBeats, getLicense, getLicenses } = require("../controllers/admin");
const { authenticate } = require("../middlewares/auth");
const { addToCart, getCart, deleteCartItem, checkoutWithPaystack, verifyPaymentWithPayStack } = require("../controllers/user");

// public
router.route("/beat").get(getBeats);
router.route("/beat/:id").get(getBeat);
router.route("/license").get(getLicenses);
router.route("/license/:id").get(getLicense);

// protected
router.route("/cart").all(authenticate).post(addToCart).get(getCart)
router.route("/cart/:id").all(authenticate).delete(deleteCartItem);
router.route("/checkout/paystack").all(authenticate).post(checkoutWithPaystack);
router.route("/checkout/paystack/:reference").all(authenticate).post(verifyPaymentWithPayStack);
module.exports = router;