// TODO: unit test
import asyncHandler from "express-async-handler";
import { CategorizationRequestedEvent } from "../../domain/events/categorization-requested-event";
import { TransactionImportedEvent } from "../../domain/events/transaction-imported-event";

const TransactionController = (
  app,
  accountHistoryCsv,
  domainEvents,
  transactionRepository,
  categorizationRecommender,
  transactionSplitter
) => {
  return {
    register: () => {
      app.post(
        "/api/commands/transactions/ids",
        asyncHandler(async (request, response, next) => {
          const transactions = await transactionRepository.getManyById(
            request.user.tenant,
            request.body
          );
          response.status(200).send(transactions);
        })
      );
      app.post(
        "/api/commands/transactions/states/uncategorized",
        asyncHandler(async (request, response, next) => {
          // FIX: make this more multi-tenant friendly
          const transactions = await accountHistoryCsv.get(request.user.tenant);
          transactions.forEach(transaction => {
            const event = new TransactionImportedEvent(transaction);
            domainEvents.raise(event);
          });
          response.status(200).send(transactions);
        })
      );
      app.post(
        "/api/commands/transactions/states/uncategorized/:id/split",
        asyncHandler(async (request, response, next) => {
          const originalTransactionId = request.body.originalTransaction.id;
          const amount = request.body.amount;
          if (request.params.id !== originalTransactionId) {
            response.status(400).send();
          }
          const originalTransaction = await transactionRepository.getById(
            request.user.tenant,
            originalTransactionId
          );
          if (
            originalTransaction._rev !== request.body.originalTransaction._rev
          ) {
            response.status(409).end();
            return;
          }
          const splitTransactions = await transactionSplitter.split(
            originalTransaction,
            amount
          );
          response.status(201).send(splitTransactions);
        })
      );
      app.get(
        "/api/commands/transactions/states/uncategorized",
        asyncHandler(async (request, response, next) => {
          const count = 100;
          const transactions = await transactionRepository.getUncategorizedTransactions(
            request.user.tenant,
            count
          );
          response.status(200).send(transactions);
        })
      );
      app.get(
        "/api/commands/transactions/states/uncategorized/grouped",
        asyncHandler(async (request, response, next) => {
          const transactions = await transactionRepository.getUncategorizedTransactions(
            request.user.tenant
          );
          const groups = categorizationRecommender.recommend(transactions);
          response.status(200).send(groups);
        })
      );
      app.post(
        "/api/commands/transactions/states/categorized",
        asyncHandler(async (request, response, next) => {
          const transactions = await transactionRepository.getManyById(
            request.user.tenant,
            request.body.transactions
          );
          transactions.forEach(transaction => {
            const event = new CategorizationRequestedEvent(
              transaction.id,
              request.user.tenant,
              request.body.categorization
            );
            domainEvents.raise(event);
          });
          response.status(200).end();
        })
      );
    }
  };
};

export { TransactionController };
