const express = require("express");
const authController = require("../controllers/authController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/auth/google", authController.googleStart);
router.get("/auth/google/callback", authController.googleCallback);
router.get("/me", requireAuth, authController.me);
router.post("/logout", authController.logout);

module.exports = router;
