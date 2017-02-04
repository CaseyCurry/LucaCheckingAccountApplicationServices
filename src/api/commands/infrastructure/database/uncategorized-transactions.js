"use strict";

const errors = require("common-errors");
const config = require("./config");
const buildDatabase = require("./build-database");
const dataUrl = `${config.database}/uncategorized-transactions`;

module.exports = class UncategorizedTransactions {
  constructor(database) {
    this.database = database;
  }

  add(transactionId) {
    return new Promise((resolve) => {
      if (!transactionId) {
        throw errors.ArgumentNullError("transactionId", new Error());
      }
      const document = {
        transactionId
      };
      resolve(this.database
        .post(dataUrl, document));
    });
  }

  remove(transactionId) {
    return new Promise((resolve, reject) => {
      if (!transactionId) {
        throw errors.ArgumentNullError("transactionId", new Error());
      }
      this.database
        .get(`${dataUrl}/_design/doc/_view/by-transaction-id?key=${transactionId}`)
        .then((result) => {
          resolve(Promise.all(result.data.rows.map(transaction => {
            return this.database
              .delete(`${dataUrl}/${transaction.id}?rev=${transaction.value}`);
          })));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  configureDatabase() {
    const views = {
      "views": {
        "by-transaction-id": {
          "map": "function (doc) {\n  emit(doc.transactionId, doc._rev);\n}"
        }
      },
      "language": "javascript"
    };
    return buildDatabase(this.database, dataUrl, views);
  }
};
