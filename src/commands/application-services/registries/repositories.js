import { Datastores } from "./datastores";
import { TransactionRepository } from "../../infrastructure/couchdb/repositories/transaction-repository";

const transactionRepository = TransactionRepository(Datastores.transaction);

const Repositories = {
  transaction: transactionRepository
};

export { Repositories };
