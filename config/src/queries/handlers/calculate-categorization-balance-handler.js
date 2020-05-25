import { categorizedBalances } from "../data/aws/dynamodb/categorized-balances";

// TODO: unit test
export const calculate = async (event, context) => {
  try {
    // TODO: make idempotent
    const transaction = JSON.parse(event.Records[0].Sns.Message).message
      .transaction;
    const tenantId = transaction.tenantId;
    const date = new Date(transaction.date);
    const period = date.getFullYear() * 100 + date.getMonth() + 1;
    const categorization = transaction.categorization;
    const amount = transaction.isDeposit
      ? transaction.amount
      : transaction.amount * -1;
    await categorizedBalances.update(tenantId, period, categorization, amount);
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
