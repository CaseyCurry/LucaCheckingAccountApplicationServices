import { BaseAggregate } from "./base-aggregate";
import { Categorization } from "../value-objects/categorization";

// TODO: unit test
const Transaction = class extends BaseAggregate {
  constructor({
    _rev,
    id,
    tenantId,
    account,
    date,
    description,
    amount,
    isDeposit,
    categorization,
    relatedTransaction,
    ignoreInReports
  }) {
    super(_rev);
    this.id = id;
    this.tenantId = tenantId;
    this.account = account;
    this.date = date;
    this.description = description;
    this.amount = amount;
    this.isDeposit = isDeposit;
    if (categorization) {
      this.categorization = Categorization(categorization);
    }
    this.relatedTransaction = relatedTransaction;
    this.ignoreInReports = ignoreInReports;
  }

  categorize(categorization) {
    this.categorization = categorization;
  }

  splitAmount(amount) {
    const minRemainingAmount = 0.01;
    const maxRemainingAmount = this.amount - 0.01;
    if (amount > maxRemainingAmount || amount < minRemainingAmount) {
      throw new Error("The amount is invalid");
    }
    this.amount = parseFloat((this.amount - amount).toFixed(2));
  }
};

export { Transaction };
