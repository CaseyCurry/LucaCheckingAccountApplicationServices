// TODO: unit test
import readLine from "readline";
import { client } from "./client";
import { adaptTransaction } from "./transaction-adapter";

const accountHistoryCsv = {
  get: tenantId => {
    return new Promise((resolve, reject) => {
      const stream = client
        .getObject({
          Bucket: process.env.domainBucket,
          Key: "AccountHistory.csv"
        })
        .createReadStream();
      stream.on("error", error => reject(error));
      const file = readLine.createInterface({
        input: stream
      });
      const transactions = [];
      file.on("line", line => {
        if (line.indexOf("Account Number") < 0) {
          const transaction = adaptTransaction(tenantId, line);
          transactions.push(transaction);
        }
      });
      file.on("close", () => {
        resolve(transactions);
      });
    });
  }
};

export { accountHistoryCsv };
