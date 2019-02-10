import { TransactionController } from "../controllers/transaction-controller";
import { AccountHistoryCsv } from "../../infrastructure/file-system/account-history-csv";
import { Repositories } from "./repositories";

const Controllers = (app, domainEvents, domainServices) => {
  const transactionController = TransactionController(
    app,
    AccountHistoryCsv,
    domainEvents,
    Repositories.transaction,
    domainServices.categorizationRecommender,
    domainServices.transactionSplitter
  );
  return {
    transaction: transactionController
  };
};

export { Controllers };
