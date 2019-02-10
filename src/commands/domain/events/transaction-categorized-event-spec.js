import { expect } from "chai";
import { TransactionCategorizedEvent as Event } from "./transaction-categorized-event";

describe("transaction categorized event suite", () => {
  const transaction = {
    id: "123",
    tenantId: "456",
    categorization: {
      category: "housing",
      subcategory: "rent"
    },
    amount: 100,
    isDeposit: true
  };
  let event;

  beforeEach(() => {
    event = new Event(transaction);
  });

  it("should include an id", () => {
    expect(event.id).to.exist;
  });

  it("should include the time it occurred", () => {
    expect(event.occurredOn).to.exist;
  });

  it("should include the name", () => {
    expect(event.name).to.equal("checking-account.categorization-requested");
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId).to.equal(999);
  });

  it("should include the transaction", () => {
    expect(event.message.transaction).to.deep.equal({
      id: transaction.id,
      tenantId: transaction.tenantId,
      categorization: transaction.categorization,
      amount: transaction.amount,
      isDeposit: transaction.isDeposit
    });
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event)).to.equal(true);
  });
});
