"use strict";

module.exports = class DomainDate {
  constructor(date) {
    date = date && !date.value && isNaN(date) ?
      Date.parse(date) :
      date;
    if (date && date.value) {
      this.value = date.value;
    } else {
      this.value = date ?
        new Date(date)
        .toISOString() :
        null;
    }
    Object.freeze(this);
  }
};
