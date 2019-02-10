import buildStore from "./build-store";

const TransactionStore = (http, baseUrl) => {
  const url = `${baseUrl}checking-account%2Ftransactions/`;
  return {
    url,
    http,
    build: () => {
      const views = {
        views: {
          "uncategorized-transactions": {
            map:
              "function (doc) {\n  if (!doc.categorization) {\n    emit(doc.tenantId, null);\n  }\n}"
          },
          balances: {
            map:
              "function (doc) {\n  if (doc.categorization && !doc.ignoreInReports) {\n    var date = new Date(doc.date);\n    var year = date.getFullYear();\n    var month = date.getMonth() + 1;\n   emit([\n      doc.tenantId,\n      (year * 100 + month).toString(),\n      doc.account,\n      doc.categorization.category,\n      doc.categorization.subcategory], doc.isDeposit ? doc.amount : doc.amount * -1);\n  }\n}",
            reduce: "_sum"
          },
          "transactions-by-tenant": {
            map: "function (doc) {\n  emit([doc.tenantId, doc.id], null);\n}"
          },
          "transactions-by-category": {
            map:
              "function (doc) {\n  if (doc.categorization && !doc.ignoreInReports) {\n    var date = new Date(doc.date);\n    var year = date.getFullYear();\n    var month = (date.getMonth() + 1);\n    \n    emit([doc.tenantId, doc.categorization.category, ((year * 100) + month).toString()], null);\n  }\n}"
          }
        },
        language: "javascript"
      };
      return buildStore(http, url, views);
    }
  };
};

export { TransactionStore };
