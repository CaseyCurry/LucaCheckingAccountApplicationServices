import { accountBalances } from "../data/aws/dynamodb/account-balances";

// TODO: unit test
export const calculate = async (event, context) => {
  try {
    // TODO: make idempotent
    const transaction = JSON.parse(event.Records[0].Sns.Message).message
      .transaction;
    const tenantId = transaction.tenantId;
    const account = transaction.account;
    const amount = transaction.isDeposit
      ? transaction.amount
      : transaction.amount * -1;
    await accountBalances.update(tenantId, account, amount);
  } catch (error) {
    console.error(error);
    context.fail(error);
  }
};
