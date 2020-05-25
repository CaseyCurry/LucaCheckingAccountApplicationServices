import { expect } from "chai";
import { TransactionImportedEvent as Event } from "./transaction-imported-event";

describe("transaction imported event suite", () => {
  const transaction = {
    id: 123,
    categorization: {}
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
    expect(event.name).to.equal("transaction-imported");
  });

  xit("should include the correlation id", () => {
    expect(event.correlationId).to.equal(999);
  });

  it("should include the transaction id", () => {
    expect(event.message.transaction).to.deep.equal(transaction);
  });

  it("should be immutable", () => {
    expect(Object.isFrozen(event)).to.equal(true);
  });
});
