const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountControllers = require("../controllers/account.controller");
const router = express.Router();

/**
 *  - POST /api/accounts/
 *  - Create a new account
 *  - protected route
 */
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountControllers.createAccountController,
);

module.exports = router;
