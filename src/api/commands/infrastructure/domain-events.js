"use strict";

const errors = require("common-errors");
const subscribers = {};

module.exports.listen = (listener) => {
  if (!listener.eventName) {
    throw new errors.NotImplementedError("listener.eventName", new Error());
  }
  if (!listener.respond) {
    throw new errors.NotImplementedError("listener.respond", new Error());
  }
  if (!subscribers[listener.eventName]) {
    subscribers[listener.eventName] = [];
  }
  subscribers[listener.eventName].push(listener);
};

module.exports.ignore = (listener) => {
  if (!listener || !listener.eventName) {
    return;
  }
  const listeners = subscribers[listener.eventName];
  if (!listeners || listeners.length === 0) {
    return;
  }
  const index = listeners.indexOf(listener);
  if (index > -1) {
    subscribers[listener.eventName].splice(index, 1);
  }
};

module.exports.notify = (event) => {
  return new Promise((resolve, reject) => {
    if (!event.eventName) {
      reject(new errors.NotImplementedError("event.eventName", new Error()));
    }
    const listeners = subscribers[event.eventName];
    if (listeners) {
      resolve(Promise
        .all(listeners.map(listener => listener.respond(event))));
    }
  });
};
