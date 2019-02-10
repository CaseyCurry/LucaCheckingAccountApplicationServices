import deepFreeze from "deep-freeze";
import { Event } from "./event";

const TransactionCategorizedEvent = class extends Event {
  constructor(transactionId, tenantId, categorization, amount, isDeposit) {
    super({ name: "checking-account.transaction-categorized", version: 1 });
    this.message.transaction = {
      id: transactionId,
      tenantId,
      categorization,
      amount,
      isDeposit
    };
    deepFreeze(this);
  }
};

export { TransactionCategorizedEvent };
