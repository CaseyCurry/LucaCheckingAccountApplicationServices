import deepFreeze from "deep-freeze";
import { Event } from "./event";

const CategorizationRequestedEvent = class extends Event {
  constructor(transactionId, tenantId, categorization) {
    super({ name: "checking-account.categorization-requested", version: 1 });
    this.message.transaction = {
      id: transactionId,
      tenantId,
      categorization
    };
    deepFreeze(this);
  }
};

export { CategorizationRequestedEvent };
