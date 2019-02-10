// TODO: unit test
import asyncHandler from "express-async-handler";

const TransactionController = (app, transactionData) => {
  return {
    register: () => {
      app.get(
        "/api/queries/transactions/categories/:category/:beginningPeriod/:endingPeriod",
        asyncHandler(async (request, response, next) => {
          const category = request.params.category;
          const beginningPeriod = request.params.beginningPeriod;
          const endingPeriod = request.params.endingPeriod;
          const transactions = await transactionData.findTransactions(
            request.user.tenant,
            category,
            beginningPeriod,
            endingPeriod
          );
          response.status(200).send(transactions);
        })
      );
    }
  };
};

export { TransactionController };
