import { Transaction } from "../../../domain/aggregates/transaction";
import { client } from "./client";

const table = process.env.transactionsTable;

const scrub = transaction => {
  if (!transaction.categorization) {
    /* The isUncategorized property is used in the ByUncategorized index. If
       there is a categorization value then the isCategorized property will
       not exist and the transaction will not be included in the index.
       DynamoDB doesn't support range indexes on booleans, so this is being
       set to a number. */
    return { ...transaction, isUncategorized: 1 };
  }
  return transaction;
};

const transactionRepository = {
  create: transaction => {
    return client
      .put({
        TableName: table,
        Item: scrub(transaction),
        ReturnValues: "NONE"
      })
      .promise();
  },
  update: transaction => {
    return client
      .put({
        TableName: table,
        Item: scrub(transaction),
        ReturnValues: "NONE"
      })
      .promise();
  },
  getById: (tenantId, id) => {
    return client
      .query({
        TableName: table,
        KeyConditionExpression: "tenantId = :tenantId and id = :id",
        ExpressionAttributeValues: {
          ":tenantId": tenantId,
          ":id": id
        },
        ReturnConsumedCapacity: "NONE"
      })
      .promise()
      .then(data => {
        if (data.Count) {
          const transaction = new Transaction(data.Items[0]);
          return transaction;
        }
      });
  },
  getManyById: (tenantId, ids) => {
    if (!ids.length) {
      return Promise.resolve([]);
    }
    return client
      .batchGet({
        RequestItems: {
          [`${table}`]: {
            Keys: ids.map(id => {
              return { tenantId, id };
            })
          }
        },
        ReturnConsumedCapacity: "NONE"
      })
      .promise()
      .then(data => data.Responses[table].map(item => new Transaction(item)));
  },
  getUncategorizedTransactions: tenantId => {
    return client
      .query({
        TableName: table,
        IndexName: "ByUncategorized",
        KeyConditionExpression: "tenantId = :tenantId",
        ExpressionAttributeValues: { ":tenantId": tenantId }
      })
      .promise()
      .then(data => {
        const transactions = data.Items.map(item => new Transaction(item));
        return transactions;
      });
  }
};

export { transactionRepository };
