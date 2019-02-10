// TODO: unit test
const TransactionData = datastore => {
  return {
    findBalances: tenantId => {
      let url = `${datastore.url}_design/doc/_view/balances?group=true`;
      url = `${url}&startkey=["${tenantId}"]&endkey=["${tenantId}",{}]`;
      return datastore
        .http(url)
        .then(response => response.json())
        .then(body => {
          return body.rows.map(row => {
            return {
              period: row.key[1],
              categorization: {
                category: row.key[3],
                subcategory: row.key[4]
              },
              account: row.key[2],
              amount: row.value
            };
          });
        });
    },
    findTransactions: (tenantId, category, beginningPeriod, endingPeriod) => {
      let url = `${
        datastore.url
      }_design/doc/_view/transactions-by-category?include_docs=true`;
      url = `${url}&startkey=["${tenantId}","${category}","${beginningPeriod}"]&endkey=["${tenantId}","${category}","${endingPeriod}",{}]`;
      return datastore
        .http(url)
        .then(response => response.json())
        .then(body => {
          return body.rows.map(row => row.doc);
        });
    }
  };
};

export { TransactionData };
