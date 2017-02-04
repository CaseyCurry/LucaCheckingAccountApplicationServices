"use strict";

const DomainDate = require("../domain/value-objects/domain-date");
const BankAccount = require("../domain/factories/bank-account");
const TransactionPosted = require("../domain/events/transaction-posted");
const minimumDateToImport = Date.UTC(2016, 8);

module.exports = async(request, response, dependencies) => {
  validateRequestBody(request.body);
  const credentials = request.body;
  const result = await importTransactions(credentials, dependencies);
  response
    .status(200)
    .json(result);
};

const importTransactions = async(credentials, dependencies) => {
  const latestTransactionDate = await dependencies
    .transactions
    .findLatestTransactionDate();
  const importTransactionDate = latestTransactionDate ?
    latestTransactionDate :
    minimumDateToImport;
  return await importNewTransactions(
    credentials, importTransactionDate, dependencies);
};

const importNewTransactions =
  async(credentials, importTransactionDate, dependencies) => {
    const transactions = await dependencies
      .bankWebsite
      .findNewTransactions(credentials, importTransactionDate);
    const bankAccount = new BankAccount(dependencies.domainEvents);
    const errors = [];

    for (let transaction of transactions) {
      try {
        await persistTransaction(bankAccount, dependencies, transaction);
      } catch (error) {
        if (error.message != "NotPosted") {
          errors.push(error);
        }
      }
    }

    return {
      importTransactionDate: new DomainDate(importTransactionDate),
      transactionCount: transactions.length,
      transactions,
      errors
    };
  };

const persistTransaction = async(bankAccount, dependencies, transaction) => {
  const importedTransaction = await bankAccount
    .importTransaction(transaction);
  const event = new TransactionPosted(importedTransaction);
  await dependencies
    .transactions
    .post(event);
};

const validateRequestBody = (body) => {
  const errors = [];

  if (!body) {
    errors.push({
      message: "body is required"
    });
    throw errors;
  }

  if (!body.userId) {
    errors.push({
      message: "body.userId is required"
    });
  }

  if (!body.password) {
    errors.push({
      message: "body.password is required"
    });
  }

  if (errors.length > 0) {
    throw errors;
  }
};
