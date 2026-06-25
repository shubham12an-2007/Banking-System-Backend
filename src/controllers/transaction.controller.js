const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");

/**
 * - Create a new transaction
 * THE 10 STEP TRASFER FLOW:
 *  1. Validate the request body to ensure all required fields are present and valid.
 * 2. Validate idompotency key to prevent duplicate transactions.
 *  3. Check Account Status
 *  4. Derive sender balance from ledger
 *  5. Create transaction (PENDING)
 *  6. Create Debit ledger entry
 *  7.  Create Credit ledger entry
 *  8.  Mark transaction as COMPLETED
 * 9. Commit MONGODB session
 * 10. send email notification to sender and receiver
 */

async function createTransaction(req, res) {
  /**
   * - 1. Validate request body to ensure all required fields are present and valid.
   */

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({ message: "Account not found" });
  }
}

module.exports = {
  createTransaction,
};
