"use strict";

const config = require("./config");

module.exports = async(request, response, dependencies) => {
  let transactions =
    await findTransactions(dependencies.database);
  transactions = transactions
    .map(transaction => {
      return {
        id: transaction.doc.transaction.id,
        date: transaction.doc.transaction.date.value,
        description: transaction.doc.transaction.description,
        amount: transaction.doc.transaction.amount
      };
    });
  response
    .status(200)
    .json(transactions);
};

const findTransactions = async(database) => {
  const transactionIds = await findTransactionIds(database);
  const url = config.database + "/transactions/_design/doc/_view/" +
    "posted-by-transaction-id?include_docs=true";
  const transactions = await database
    .post(url, {
      keys: transactionIds
    });
  return transactions.data.rows;
};

const findTransactionIds = async(database) => {
  const url = config.database +
    "/uncategorized-transactions/_design/doc/_view/by-transaction-id";
  const transactionIds = await database
    .get(url);
  return transactionIds.data.rows.map(id => id.key);
};
