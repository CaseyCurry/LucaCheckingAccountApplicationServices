import { transactionRepository } from "../infrastructure/aws/dynamoDb/transaction-repository";
import { domainEvents } from "../infrastructure/aws/sns/domain-events";

// TODO: unit test
export const categorize = async (event, context) => {
  try {
    const transaction = JSON.parse(event.Records[0].Sns.Message).message
      .transaction;
    const existingTransaction = await transactionRepository.getById(
      transaction.tenantId,
      transaction.id
    );
    if (!existingTransaction) {
      return;
    }
    if (existingTransaction.categorization === transaction.categorization) {
      return;
    }
    await existingTransaction.categorize(transaction.categorization);
    await transactionRepository.update(existingTransaction);
    await domainEvents.raise(existingTransaction.domainEvents.raisedEvents);
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
