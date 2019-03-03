import { TransactionImportedEvent } from "../src/commands/domain/events/transaction-imported-event";
import fs from "fs";
import AWS from "aws-sdk";

const allTransactions = require("./all-transaction.json");
const transactions = allTransactions.slice(0, 3).map(x => x.doc);
// const transactions = allTransactions.map(x => x.doc);

const events = [];

transactions.forEach(transaction => {
  delete transaction.categorization;
  delete transaction._id;
  delete transaction._rev;
  events.push(new TransactionImportedEvent(transaction));
});

AWS.config.update({ region: "us-west-2" });
const client = new AWS.SNS({});

const domainEvents = {
  raise: event => {
    const arn =
      "arn:aws:sns:us-west-2:741431045153:dev-luca-checking-acct-app-svcs-transaction-imported";
    const message = {
      Message: JSON.stringify(event),
      TopicArn: arn
    };
    // console.log(message);
    // return Promise.resolve();
    return client.publish(message).promise();
  }
};

const failures = `./miscellaneous/logs/failures-transactions.${new Date().toISOString()}.json`;
fs.appendFile(failures, "[", error => {
  if (error) console.error(error);
});

console.log("event count:", events.length);

let publishCount = 0;

const timer = setInterval(() => {
  if (!events.length) {
    clearInterval(timer);
    fs.appendFile(failures, "]", error => {
      if (error) console.log(error);
      console.log("publish count:", publishCount);
    });
  } else {
    publishCount++;
    const event = events.splice(0, 1)[0];
    domainEvents.raise(event).catch(error => {
      if (error) {
        console.error(error.message);
        fs.appendFile(failures, `${JSON.stringify(event)},`, error => {
          if (error) console.error(error);
        });
      }
    });
  }
}, 50);
