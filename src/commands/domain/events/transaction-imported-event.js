import deepFreeze from "deep-freeze";
import { Event } from "./event";

const name =
  process.env.transactionImportedEvent ||
  process.env.npm_package_config_transactionImportedEvent;

const TransactionImportedEvent = class extends Event {
  constructor(transaction) {
    super({ name, version: 1 });
    this.message.transaction = Object.assign({}, transaction);
    deepFreeze(this);
  }
};

export { TransactionImportedEvent };
