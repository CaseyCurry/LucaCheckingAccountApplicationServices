import jwt from "jsonwebtoken";
import { transactionRepository } from "../infrastructure/aws/dynamoDb/transaction-repository";
import { splitTransaction } from "../domain/services/transaction-splitter";
import { Transaction } from "../domain/aggregates/transaction";

// TODO: unit test
export const split = async event => {
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
    const body = JSON.parse(event.body);
    const originalTransactionId = body.originalTransaction.id;
    const amount = body.amount;
    if (event.pathParameters.id !== originalTransactionId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    const originalTransaction = await transactionRepository.getById(
      user.tenant,
      originalTransactionId
    );
    if (
      originalTransaction.hash !==
      new Transaction(body.originalTransaction).hash
    ) {
      return {
        statusCode: 409,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      };
    }
    const splitTransactions = await splitTransaction(
      originalTransaction,
      amount
    );
    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(splitTransactions)
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
