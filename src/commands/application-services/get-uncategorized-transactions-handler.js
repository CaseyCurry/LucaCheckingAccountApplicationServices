import jwt from "jsonwebtoken";
import { transactionRepository } from "../infrastructure/aws/dynamoDb/transaction-repository";
import { categorizationRecommender } from "../domain/services/categorization-recommender";

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
    const transactions = await transactionRepository.getUncategorizedTransactions(
      user.tenant
    );
    const groups = categorizationRecommender.recommend(transactions);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(groups)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    };
  }
};
