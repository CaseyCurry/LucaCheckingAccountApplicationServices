"use strict";

const Transaction = require("../../domain/aggregates/transaction");
const errors = require("common-errors");
const config = require("./config");
const buildDatabase = require("./build-database");
const dataUrl = `${config.database}/transactions`;
const postedByDateViewName = "posted-by-date";
const byIdViewName = "by-id";

module.exports = class Transactions {
  constructor(database, domainEvents) {
    this.database = database;
    this.domainEvents = domainEvents;
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      this
        .database
        .get(`${dataUrl}/_design/doc/_view/${byIdViewName}?key=${id}`)
        .then((response) => {
          let transaction = {};
          sortEventStreamByTimeOccurred(response.data.rows)
            .forEach(event => {
              transaction =
                Object.assign({}, transaction, event.value.transaction);
            });
          if (Object.keys(transaction)
            .length > 0) {
            resolve(new Transaction(transaction.id, transaction.accountId,
              transaction.date, transaction.description, transaction.amount,
              transaction.checkNumber, this.domainEvents,
              transaction.categorization));
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  post(event) {
    return new Promise(resolve => {
      if (!event) {
        throw errors.ArgumentNullError("event", new Error());
      }
      resolve(this.database
        .post(dataUrl, event));
    });
  }

  categorize(event) {
    return new Promise(resolve => {
      if (!event) {
        throw errors.ArgumentNullError("event", new Error());
      }
      resolve(this.database
        .post(dataUrl, event));
    });
  }

  findLatestTransactionDate() {
    return new Promise((resolve, reject) => {
      const viewUrl =
        `${dataUrl}/_design/doc/_view/${postedByDateViewName}?descending=true&limit=1`;
      this.database
        .get(viewUrl)
        .then((response) => {
          const latestTransactionDate = response.data.rows.length === 1 ?
            response.data.rows[0].key :
            null;
          resolve(latestTransactionDate);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  configureDatabase() {
    const views = {
      "views": {
        [postedByDateViewName]: {
          "map": "function (doc) {\n  if (doc.eventName && doc.eventName === \"TRANSACTION_POSTED\") {\n    emit(Date.parse(doc.transaction.date.value), 1);\n  }\n}"
        },
        [byIdViewName]: {
          "map": "function (doc) {\n  emit(doc.transaction.id, doc);\n}"
        },
        "posted-by-transaction-id": {
          "map": "function (doc) {\n  if (doc.eventName && doc.eventName === \"TRANSACTION_POSTED\") {\n    emit(doc.transaction.id, 1);\n  }\n}"
        }
      },
      "language": "javascript"
    };
    return buildDatabase(this.database, dataUrl, views);
  }
};

const sortEventStreamByTimeOccurred = (stream) => {
  return stream
    .sort((x, y) => {
      if (x.value.timeOccurred < y.value.timeOccurred) {
        return -1;
      }
      if (x.value.timeOccurred > y.value.timeOccurred) {
        return 1;
      }
      return 0;
    });
};
