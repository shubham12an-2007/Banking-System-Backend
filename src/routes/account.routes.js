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

/**
 * - Get /api/accounts/
 * - Get all accounts for the logged-in user
 * - protected route
 */

router.get(
  "/",
  authMiddleware.authMiddleware,
  accountControllers.getAllAccountsController,
);

/**
 * - GET /api/accounts/balance/:accountId
 */

router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  accountControllers.getAccountByIdController,
);

module.exports = router;
