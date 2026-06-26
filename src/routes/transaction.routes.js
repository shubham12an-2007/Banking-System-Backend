const { Router } = require("express");
const transactionRoutes = Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");
/**
 *  - POST /api/transactions
 *  - Create a new transaction
 */

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);

/**
 * - POST api/transactions/system/initial-funds
 * - Create  initial funds for the system
 */

transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authSystemMiddleware,
  transactionController.createInitialFunds,
);

module.exports = transactionRoutes;
