"use strict";

const numberOfDaysToLookBack = 10;
const dateToLookBack =
  Date.parse(new Date()) - (1000 * 60 * 60 * 24 * numberOfDaysToLookBack);

module.exports = async(request, response, dependencies) => {
  const transactions = await dependencies
    .bankWebsite
    .findNewTransactions(dateToLookBack);
  response
    .status(200)
    .json(transactions);
};
