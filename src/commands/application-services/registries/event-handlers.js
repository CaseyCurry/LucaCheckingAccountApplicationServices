import { TransactionImportedHandler } from "../event-handlers/transaction-imported-handler";
import { CategorizationRequestedHandler } from "../event-handlers/categorization-requested-handler";
import { TransactionSplitHandler } from "../event-handlers/transaction-split-handler";
import { Repositories } from "./repositories";

const EventHandlers = domainEvents => {
  const transactionImportedHandler = TransactionImportedHandler(
    domainEvents,
    Repositories.transaction
  );
  const categorizationRequestedHandler = CategorizationRequestedHandler(
    domainEvents,
    Repositories.transaction
  );
  const transactionSplitHandler = TransactionSplitHandler(
    domainEvents,
    Repositories.transaction
  );
  return {
    transactionImported: transactionImportedHandler,
    categorizationRequested: categorizationRequestedHandler,
    transactionSplit: transactionSplitHandler
  };
};

export { EventHandlers };
