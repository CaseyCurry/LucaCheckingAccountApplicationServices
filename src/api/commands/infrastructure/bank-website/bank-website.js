"use strict";

const loginPage = require(
  "../../infrastructure/bank-website/site-elements/login-page");
const tokenRequest = require("../../infrastructure/bank-website/site-elements/token-request");
const transactionsPage = require(
  "../../infrastructure/bank-website/site-elements/transactions-page");
const rowsPerPage = 50;

module.exports = class BankWebsite {
  constructor(domainEvents) {
    this.domainEvents = domainEvents;
  }

  async findNewTransactions(credentials, latestTransactionDate) {
    const host = "secure.onlineaccess1.com";
    const userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS" +
      " X) AppleWebKit/601.1.46 (KHTML, like Gecko) Versi" +
      "on/9.0 Mobile/13B143 Safari/601.1";
    const cookies = await loginPage.login(credentials, host, userAgent);
    const token = await tokenRequest.get(host, userAgent, cookies);
    const transactions = await findTransactions(
      host, userAgent, cookies, token, latestTransactionDate);
    return transactions;
  }
};

const findTransactions = async(host, userAgent, cookies, token,
  latestTransactionDate, pageNumber) => {
  if (!pageNumber) {
    pageNumber = 1;
  }
  const allTransactions = [];
  let transactions = await transactionsPage.viewTransactions(
    host, userAgent, cookies, token, pageNumber, rowsPerPage);
  if (transactions.length === 0) {
    return [];
  }
  const earliestTransactionDate = getEarliestTransactionDate(
    transactions);
  if (earliestTransactionDate <= latestTransactionDate) {
    const newTransactions = removeOldTransactions(transactions,
      latestTransactionDate);
    return newTransactions;
  } else {
    allTransactions.push(...transactions);
    transactions = await findTransactions(host, userAgent, cookies, token,
      latestTransactionDate, ++pageNumber);
    allTransactions.push(...transactions);
    return allTransactions;
  }
};

const removeOldTransactions = (transactions, latestTransactionDate) => {
  return transactions.filter((transaction) => {
    return Date.parse(transaction.extended.postDate) >
      latestTransactionDate;
  });
};

const getEarliestTransactionDate = (transactions) => {
  const dates = transactions.map(transaction => {
    return Date.parse(transaction.extended.postDate);
  });
  return dates.reduce((x, y) => {
    if (x < y) {
      return x;
    } else {
      return y;
    }
  });
};
