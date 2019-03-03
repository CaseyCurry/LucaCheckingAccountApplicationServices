import { client } from "./client";

const table = process.env.categorizedBalancesTable;

const categorizedBalances = {
  update: (tenantId, period, categorization, amount) => {
    return client
      .update({
        TableName: table,
        Key: {
          tenantId,
          period
        },
        UpdateExpression:
          "set #categorization = if_not_exists(#categorization, :zero) + :amount",
        ExpressionAttributeNames: {
          "#categorization": categorization
        },
        ExpressionAttributeValues: {
          ":amount": amount,
          ":zero": 0
        }
      })
      .promise();
  },
  get: (tenantId, beginningPeriod, endingPeriod) => {
    return client
      .query({
        TableName: table,
        KeyConditionExpression:
          "tenantId = :tenantId and period between :beginningPeriod and :endingPeriod",
        ExpressionAttributeValues: {
          ":tenantId": tenantId,
          ":beginningPeriod": parseInt(beginningPeriod),
          ":endingPeriod": parseInt(endingPeriod)
        },
        ReturnConsumedCapacity: "NONE"
      })
      .promise()
      .then(data => {
        return data.Items.map(subcategories => {
          const period = subcategories.period;
          delete subcategories.tenantId;
          delete subcategories.period;
          return {
            period,
            subcategories: Object.keys(subcategories).map(subcategory => {
              return {
                id: subcategory,
                balance: subcategories[subcategory]
              };
            })
          };
        });
      });
  }
};

export { categorizedBalances };
