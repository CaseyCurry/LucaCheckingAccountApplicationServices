import { expect } from "chai";
import { TransactionSplitEvent as Event } from "./transaction-split-event";

describe("transaction split event suite", () => {
  const originalTransactionId = 123;
  const transaction = {
    id: 456
  };
  let event;

  beforeEach(() => {
    event = new Event(originalTransactionId, transaction);
  });

  it("should include an id", () => {
    expect(event.id).to.exist;
  });

  it("should include the time it occurred", () => {
    expect(event.occurredOn).to.exist;
  });

  it("should include the name", () => {
    expect(event.name).to.equal("transaction-split");
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId).to.equal(999);
  });

  it("should include the original transaction id", () => {
    expect(event.message.originalTransactionId).to.deep.equal(
      originalTransactionId
    );
  });

  it("should include the new transaction", () => {
    expect(event.message.transaction).to.deep.equal(transaction);
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event)).to.equal(true);
  });
});
