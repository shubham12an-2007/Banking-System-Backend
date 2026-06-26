const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");

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
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({ message: "Account not found" });
  }

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });
  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({ message: "Transaction is still pending" });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(200).json({ message: "Transaction has failed" });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res
        .status(200)
        .json({ message: "Transaction has been reversed , please retry" });
    }
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res
      .status(400)
      .json({ message: "One or both accounts are not active" });
  }

  const balance = await fromUserAccount.getBalance();
  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance: ${balance}. Required amount: ${amount}`,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const [transaction] = await transactionModel.create(
    [
      {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      },
    ],
    { session },
  );

  await ledgerModel.create(
    [
      {
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  if (req.user) {
    await emailService.sendTransactionEmail(
      req.user.email,
      req.user.name,
      amount,
      toUserAccount._id,
    );
  }

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction,
  });
}
async function createInitialFunds(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const toUserAccount = await accountModel.findById(toAccount);
  if (!toUserAccount) {
    return res.status(404).json({ message: "Account not found" });
  }

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });
  if (isTransactionAlreadyExists) {
    return res.status(200).json({
      message: "Transaction already exists",
      transaction: isTransactionAlreadyExists,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const [transaction] = await transactionModel.create(
    [
      {
        fromAccount: toAccount, // Assuming the system account is the sender
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING",
      },
    ],
    { session },
  );

  await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds added successfully",
    transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFunds,
};
