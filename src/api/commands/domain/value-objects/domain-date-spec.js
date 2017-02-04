"use strict";

const expect = require("chai")
  .expect;
const DomainDate = require("./domain-date");

describe("domain date test suite", () => {
  describe("unit test suite", () => {
    const date = "2016-12-21T06:00:00.007Z";

    it("should convert date string to a ISO string", () => {
      const domainDate = new DomainDate(date);
      expect(domainDate.value)
        .to
        .equal(date);
    });

    it("should convert date number to a ISO string", () => {
      const domainDate = new DomainDate(Date.parse(date));
      expect(domainDate.value)
        .to
        .equal(date);
    });

    it("should not allow a date to be changed", () => {
      const domainDate = new DomainDate(date);
      try {
        domainDate.value = new Date();
        throw new Error("This point should not be reached.");
      } catch (error) {
        expect(true)
          .to
          .equal(true);
      }
    });
  });
});
