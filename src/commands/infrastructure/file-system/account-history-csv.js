// TODO: unit test
import fileSystem from "fs";
import readLine from "readline";
import { TransactionAdapter } from "./transaction-adapter";

const AccountHistoryCsv = {
  get: tenantId => {
    return new Promise((resolve, reject) => {
      const stream = fileSystem.createReadStream(
        "/home/cj/Downloads/AccountHistory.csv"
      );
      stream.on("error", error => reject(error));
      const file = readLine.createInterface({
        input: stream
      });
      const transactions = [];
      file.on("line", line => {
        if (!line.includes("Account Number")) {
          const transaction = TransactionAdapter(tenantId, line);
          transactions.push(transaction);
        }
      });
      file.on("close", () => {
        resolve(transactions);
      });
    });
  }
};

export { AccountHistoryCsv };
