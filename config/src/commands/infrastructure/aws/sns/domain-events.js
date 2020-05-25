import { client } from "./client";

const publish = event => {
  return client
    .publish({
      Message: JSON.stringify(event),
      TopicArn: event.name
    })
    .promise();
};

const domainEvents = {
  raise: events => {
    if (!Array.isArray(events)) {
      return publish(events);
    }
    return events.map(event => {
      return publish(event);
    });
  }
};

export { domainEvents };
