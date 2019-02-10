// TODO: unit test
import asyncHandler from "express-async-handler";

const BalanceController = (app, transactionData) => {
  return {
    register: () => {
      app.get(
        "/api/queries/balances",
        asyncHandler(async (request, response, next) => {
          const transactions = await transactionData.findBalances(
            request.user.tenant
          );
          let accounts = transactions.reduce((x, y) => {
            if (!x[y.account]) {
              x[y.account] = [];
            }
            x[y.account].push(y);
            return x;
          }, {});
          accounts = Object.keys(accounts).map(account => {
            return {
              name: account,
              balances: accounts[account]
            };
          });
          response.status(200).send(accounts);
        })
      );
    }
  };
};

export { BalanceController };
