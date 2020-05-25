import deepFreeze from "deep-freeze";
import { Event } from "./event";

const name =
  process.env.transactionSplitEvent ||
  process.env.npm_package_config_transactionSplitEvent;

const TransactionSplitEvent = class extends Event {
  constructor(originalTransactionId, newTransaction) {
    super({ name, version: 1 });
    this.message = {
      originalTransactionId,
      transaction: Object.assign({}, newTransaction)
    };
    deepFreeze(this);
  }
};

export { TransactionSplitEvent };
