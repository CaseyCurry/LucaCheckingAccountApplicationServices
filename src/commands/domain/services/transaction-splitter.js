// TODO: unit test
import { v4 as uuidv4 } from "uuid";
import { domainEvents } from "../../infrastructure/aws/sns/domain-events";
import { transactionRepository } from "../../infrastructure/aws/dynamoDb/transaction-repository";
import { Transaction } from "../aggregates/transaction";
import { TransactionSplitEvent } from "../events/transaction-split-event";

const splitTransaction = async (originalTransaction, amount) => {
  originalTransaction.splitAmount(amount);
  await transactionRepository.update(originalTransaction);
  const newTransaction = new Transaction({
    id: uuidv4(),
    tenantId: originalTransaction.tenantId,
    account: originalTransaction.account,
    date: originalTransaction.date,
    description: originalTransaction.description,
    amount: amount,
    isDeposit: originalTransaction.isDeposit,
    relatedTransaction: originalTransaction.id,
    ignoreInReports: originalTransaction.ignoreInReports
  });
  const event = new TransactionSplitEvent(
    originalTransaction.id,
    newTransaction
  );
  console.log(JSON.stringify(event));
  await domainEvents.raise(event);
  return { originalTransaction, newTransaction };
};

export { splitTransaction };
