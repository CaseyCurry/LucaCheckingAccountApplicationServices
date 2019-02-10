import fetch from "node-fetch";
import { TransactionStore } from "../src/commands/infrastructure/couchdb/stores/transaction-store";

xdescribe("tenant update suite", function() {
  this.timeout(60000);

  it("should add tenantId to docs", done => {
    const store = TransactionStore(fetch, "http://localhost:5984/");
    let url = `${
      store.url
    }_design/doc/_view/docs-without-tenant?include_docs=true&limit=5000`;
    store
      .http(url)
      .then(response => response.json())
      .then(body => {
        body.rows.forEach(row => {
          const transaction = Object.assign({}, row.doc, {
            tenantId: "1a845694-2e9f-4619-aa42-6e5bc2394893"
          });
          console.log(transaction);
          store.http(`${store.url}${transaction.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction)
          });
        });
        done();
      });
  });
});
