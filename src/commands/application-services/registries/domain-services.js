import { TransactionSplitter } from "../../domain/services/transaction-splitter";
import { CategorizationRecommender } from "../../domain/services/categorization-recommender";
import { Repositories } from "./repositories";

const DomainServices = domainEvents => {
  const categorizationRecommender = CategorizationRecommender;
  const transactionSplitter = TransactionSplitter(
    domainEvents,
    Repositories.transaction
  );
  return {
    categorizationRecommender,
    transactionSplitter
  };
};

export { DomainServices };
