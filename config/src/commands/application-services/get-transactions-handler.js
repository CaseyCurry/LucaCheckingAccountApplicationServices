import jwt from "jsonwebtoken";
import { transactionRepository } from "../infrastructure/aws/dynamoDb/transaction-repository";

// TODO: unit test
export const get = async event => {
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
    const transactionIds = JSON.parse(event.body);
    const transactions = await transactionRepository.getManyById(
      user.tenant,
      transactionIds
    );
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
