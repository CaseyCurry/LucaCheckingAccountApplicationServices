"use strict";

const TransactionCategorizedEvent =
  require("../domain/events/transaction-categorized");

module.exports = async(request, response, dependencies) => {
  validateRequestBody(request.body);

  const transactions =
    await getTransactions(request.body.transactions, dependencies);

  for (let transaction of transactions) {
    const categorization =
      getCategorization(transaction, request.body.transactions);
    await categorizeTransaction(
      transaction, categorization, dependencies);
  }

  response
    .status(200);
};

const getTransactions = async(transactions, dependencies) => {
  const results = [];
  for (let transaction of transactions) {
    const result = await dependencies.transactions.getById(transaction.id);
    results.push(result);
  }
  return results;
};

const getCategorization = (transaction, transactions) => {
  const index = transactions
    .map(transaction => transaction.id)
    .indexOf(transaction.id);
  return transactions[index].categorization;
};

const categorizeTransaction =
  async(transaction, categorization, dependencies) => {
    await transaction.categorize(categorization);
    const event = new TransactionCategorizedEvent(transaction);
    await dependencies.transactions.categorize(event);
  };

const validateRequestBody = (body) => {
  const errors = [];

  if (!body) {
    errors.push({
      message: "body is required"
    });
    throw errors;
  }

  if (!body.transactions || !body.transactions.length) {
    errors.push({
      message: "body.transactions is required to be an array"
    });
    throw errors;
  }

  errors.push(...validateTransactions(body.transactions));

  if (errors.length > 0) {
    throw errors;
  }
};

const validateTransactions = (transactions) => {
  const errors = [];

  transactions.forEach(transaction => {
    if (!transaction.id) {
      errors.push({
        message: "body.transactions[i].id is required"
      });
    }
    if (!transaction.categorization) {
      errors.push({
        message: "body.transactions[i].categorization is required"
      });
    } else if (Object.keys(transaction.categorization)
      .length == 0) {
      errors.push({
        message: "body.transactions[i].categorization must have properties"
      });
    } else {
      Object.keys(transaction.categorization)
        .forEach(category => {
          if (isNaN(transaction.categorization[category])) {
            errors.push({
              message: "body.transactions[i].categorization[category] " +
                "must be a number"
            });
          }
        });
    }
  });

  return errors;
};
