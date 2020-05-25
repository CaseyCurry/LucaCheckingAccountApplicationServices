import deepFreeze from "deep-freeze";
import { Event } from "./event";

const name =
  process.env.categorizationRequestedEvent ||
  process.env.npm_package_config_categorizationRequestedEvent;

const CategorizationRequestedEvent = class extends Event {
  constructor(transactionId, tenantId, categorization) {
    super({ name, version: 1 });
    this.message.transaction = {
      id: transactionId,
      tenantId,
      categorization
    };
    deepFreeze(this);
  }
};

export { CategorizationRequestedEvent };
