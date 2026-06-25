const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Sender account is required"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Recipient account is required"],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
        message:
          "Status must be one of PENDING, COMPLETED, FAILED, or REVERSED",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required"],
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
