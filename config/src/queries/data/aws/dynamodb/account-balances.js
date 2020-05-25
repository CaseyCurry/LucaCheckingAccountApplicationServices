import { client } from "./client";

const table = process.env.accountBalancesTable;

const accountBalances = {
  update: (tenantId, account, amount) => {
    return client
      .update({
        TableName: table,
        Key: {
          tenantId: tenantId
        },
        UpdateExpression:
          "set #account = if_not_exists(#account, :zero) + :amount",
        ExpressionAttributeNames: {
          "#account": account
        },
        ExpressionAttributeValues: {
          ":amount": amount,
          ":zero": 0
        }
      })
      .promise();
  },
  get: tenantId => {
    return client
      .query({
        TableName: table,
        KeyConditionExpression: "tenantId = :tenantId",
        ExpressionAttributeValues: {
          ":tenantId": tenantId
        },
        ReturnConsumedCapacity: "NONE"
      })
      .promise()
      .then(data => {
        const accounts = data.Items[0];
        delete accounts.tenantId;
        return Object.keys(accounts).map(account => {
          return {
            number: account,
            balance: accounts[account]
          };
        });
      });
  }
};

export { accountBalances };
