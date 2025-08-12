const express = require("express");
const router = express.Router();
const { contactUs, signUp } = require("../controllers/user");

router.post("/contact-us", contactUs);
router.post("/sign-up", signUp);

module.exports = router;
