"use strict";

const axios = require("axios");

const domainEvents = require(
  "./api/commands/infrastructure/domain-events");

const Transactions = require(
  "./api/commands/infrastructure/database/transactions");
const transactions = new Transactions(axios, domainEvents);

const BankWebsite = require(
  "./api/commands/infrastructure/bank-website/bank-website");
const bankWebsite = new BankWebsite(domainEvents);

const UncategorizedTransactions =
  require("./api/commands/infrastructure/database/uncategorized-transactions");
const uncategorizedTransactions = new UncategorizedTransactions(axios);

module.exports.syncDatabases = async() => {
  await uncategorizedTransactions.configureDatabase();
  await transactions.configureDatabase();
};

module.exports.registerEventListeners = () => {
  const AddUncategorizedTransactionListener = require(
    "./api/commands/domain/events/listeners/add-uncategorized-transaction-listener");
  const addUncategorizedTransactionListener =
    new AddUncategorizedTransactionListener(uncategorizedTransactions);
  domainEvents.listen(addUncategorizedTransactionListener);

  const RemoveUncategorizedTransactionsListener = require(
    "./api/commands/domain/events/listeners/remove-uncategorized-transaction-listener");
  const removeUncategorizedTransactionsListener =
    new RemoveUncategorizedTransactionsListener(uncategorizedTransactions);
  domainEvents.listen(removeUncategorizedTransactionsListener);
};

module.exports.findRecentTransactions = () => {
  return {
    bankWebsite
  };
};

module.exports.importTransactions = () => {
  return {
    transactions,
    bankWebsite,
    domainEvents
  };
};

module.exports.findUncategorizedTransactions = () => {
  return {
    "database": axios
  };
};

module.exports.categorizeTransactions = () => {
  return {
    "database": axios,
    "transactions": transactions
  };
};
