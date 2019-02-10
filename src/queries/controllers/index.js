import { Dal } from "../dal";
import { BalanceController } from "./balance-controller";
import { TransactionController } from "./transaction-controller";

const Controllers = app => {
  const balanceController = new BalanceController(app, Dal.transactionData);
  const transactionController = new TransactionController(app, Dal.transactionData);
  return {
    balance: balanceController,
    transaction: transactionController
  };
};

export { Controllers };
