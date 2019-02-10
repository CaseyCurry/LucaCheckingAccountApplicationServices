import fetch from "node-fetch";
import kafka from "node-rdkafka";
import { TransactionStore } from "../src/commands/infrastructure/couchdb/stores/transaction-store";
import { TransactionCategorizedEvent } from "../src/commands/domain/events/transaction-categorized-event";
import { DomainEvents } from "../src/commands/infrastructure/kafka/domain-events";

DomainEvents(kafka).then(domainEvents => {
  const store = TransactionStore(fetch, "http://localhost:5984/");
  const url = `${store.url}_all_docs?include_docs=true`;
  store
    .http(url)
    .then(response => response.json())
    .then(body => {
      body.rows.forEach(row => {
        const transaction = row.doc;
        if (transaction.categorization) {
          const event = new TransactionCategorizedEvent(
            transaction.id,
            transaction.tenantId,
            transaction.categorization,
            transaction.amount,
            transaction.isDeposit
          );
          domainEvents.raise(event);
        }
      });
      domainEvents.end();
    });
});
