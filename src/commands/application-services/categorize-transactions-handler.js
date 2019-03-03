import jwt from "jsonwebtoken";
import { domainEvents } from "../infrastructure/aws/sns/domain-events";
import { CategorizationRequestedEvent } from "../domain/events/categorization-requested-event";

// TODO: unit test
export const categorize = async event => {
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
    const events = body.transactions.map(transactionId => {
      return new CategorizationRequestedEvent(
        transactionId,
        user.tenant,
        body.categorization
      );
    });
    await Promise.all(domainEvents.raise(events));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
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
