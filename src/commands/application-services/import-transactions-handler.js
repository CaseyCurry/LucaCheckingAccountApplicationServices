import jwt from "jsonwebtoken";
import { accountHistoryCsv } from "../infrastructure/aws/s3/account-history-csv";
import { domainEvents } from "../infrastructure/aws/sns/domain-events";
import { TransactionImportedEvent } from "../domain/events/transaction-imported-event";

// TODO: unit test
export const importTransactions = async event => {
  try {
    // TODO: move verification to separate Lambda in Users and set the user on the event
    const token = event.headers.Authorization;
    if (!token) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    let user;
    try {
      user = jwt.verify(token.replace("Bearer ", ""), process.env.jwtSecret);
    } catch (error) {
      return {
        statusCode: 401,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    // TODO: make this more multi-tenant friendly
    const transactions = await accountHistoryCsv.get(user.tenant);
    if (
      !event.queryStringParameters ||
      !("preview" in event.queryStringParameters)
    ) {
      const events = transactions.map(
        transaction => new TransactionImportedEvent(transaction)
      );
      const promises = domainEvents.raise(events);
      await Promise.all(promises);
    }
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(transactions)
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
