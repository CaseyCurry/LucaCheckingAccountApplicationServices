import fetch from "node-fetch";
import { TransactionStore } from "../../infrastructure/couchdb/stores/transaction-store";

const transactionStore = TransactionStore(fetch, process.env.DATABASE_URL);

const Datastores = {
  transaction: transactionStore
};

export { Datastores };
