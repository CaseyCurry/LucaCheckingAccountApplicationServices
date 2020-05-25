import { transactionRepository } from "../infrastructure/aws/dynamoDb/transaction-repository";

// TODO: unit test
export const createTransaction = async (event, context) => {
  // event.EventVersion = "1.0"
  // event.Records[0].Sns.SignatureVersion = 1
  // event.Records[0].Sns.Timestamp = iso date
  // event.Records[0].Sns.MessageId = uuid
  // event.Records[0].Sns.MessageAttributes = {}

  /* TODO: research simplifying the local event object because AWS already
     includes most if not all the properties I've modeled. */
  try {
    const transaction = JSON.parse(event.Records[0].Sns.Message).message
      .transaction;
    const existingTransaction = await transactionRepository.getById(
      transaction.tenantId,
      transaction.id
    );
    if (existingTransaction) {
      return;
    }
    await transactionRepository.create(transaction);
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
