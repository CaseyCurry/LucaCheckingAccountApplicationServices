import deepFreeze from "deep-freeze";
import { Event } from "./event";

const TransactionSplitEvent = class extends Event {
  constructor(originalTransactionId, newTransaction) {
    super({ name: "checking-account.transaction-split", version: 1 });
    this.message = {
      originalTransactionId,
      newTransaction: Object.assign({}, newTransaction)
    };
    deepFreeze(this);
  }
};

export { TransactionSplitEvent };
