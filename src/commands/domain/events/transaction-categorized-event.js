import deepFreeze from "deep-freeze";
import { Event } from "./event";

const name =
  process.env.transactionCategorizedEvent ||
  process.env.npm_package_config_transactionCategorizedEvent;

const TransactionCategorizedEvent = class extends Event {
  constructor(
    transactionId,
    tenantId,
    categorization,
    amount,
    isDeposit,
    date
  ) {
    super({ name, version: 1 });
    this.message.transaction = {
      id: transactionId,
      tenantId,
      categorization,
      amount,
      isDeposit,
      date
    };
    deepFreeze(this);
  }
};

export { TransactionCategorizedEvent };
