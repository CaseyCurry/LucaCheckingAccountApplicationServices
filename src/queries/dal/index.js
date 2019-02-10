import fetch from "node-fetch";
import { TransactionStore } from "./transaction-store";
import { TransactionData } from "./transaction-data";

// TODO: move to config file
const dbLocation = "http://localhost:5984/";
const transactionStore = TransactionStore(fetch, dbLocation);
const transactionData = TransactionData(transactionStore);

const Dal = {
  transactionData
};

export { Dal };
