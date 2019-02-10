// TODO: unit test
import { Transaction } from "../../../domain/aggregates/transaction";

const extendTransaction = transaction => {
  return Object.assign({}, transaction, {
    _id: transaction.id
  });
};

const TransactionRepository = datastore => {
  return {
    create: transaction => {
      const extendedTransaction = extendTransaction(transaction);
      return datastore.http(datastore.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extendedTransaction)
      });
    },
    update: transaction => {
      const extendedTransaction = extendTransaction(transaction);
      return datastore.http(`${datastore.url}${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extendedTransaction)
      });
    },
    getById: (tenantId, id) => {
      let url = `${
        datastore.url
      }_design/doc/_view/transactions-by-tenant?include_docs=true`;
      return datastore
        .http(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keys: [[tenantId, id]]
          })
        })
        .then(response => response.json())
        .then(body =>
          body.rows.length ? new Transaction(body.rows[0].doc) : null
        );
    },
    getManyById: (tenantId, ids) => {
      let url = `${
        datastore.url
      }_design/doc/_view/transactions-by-tenant?include_docs=true`;
      return datastore
        .http(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keys: ids.map(id => [tenantId, id])
          })
        })
        .then(response => response.json())
        .then(body => body.rows.map(row => new Transaction(row.doc)));
    },
    getUncategorizedTransactions: (tenantId, count) => {
      let url = `${
        datastore.url
      }_design/doc/_view/uncategorized-transactions?include_docs=true&key="${tenantId}"`;
      if (count) {
        url = `${url}&limit=${count}`;
      }
      return datastore
        .http(url)
        .then(response => response.json())
        .then(body => {
          return body.rows.map(row => new Transaction(row.doc));
        });
    }
  };
};

export { TransactionRepository };
