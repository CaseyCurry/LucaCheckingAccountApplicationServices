import deepFreeze from "deep-freeze";
import { Event } from "./event";

const TransactionImportedEvent = class extends Event {
  constructor(transaction) {
    super({ name: "checking-account.transaction-imported", version: 1 });
    this.message.transaction = Object.assign({}, transaction);
    deepFreeze(this);
  }
};

export { TransactionImportedEvent };
