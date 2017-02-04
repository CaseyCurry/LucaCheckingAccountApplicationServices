"use strict";

module.exports = class Event {
  constructor() {
    this.timeOccurred = new Date()
      .getTime();
  }
};
