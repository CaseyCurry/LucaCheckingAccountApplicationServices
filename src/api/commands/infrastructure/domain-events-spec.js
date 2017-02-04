"use strict";

const expect = require("chai")
  .expect;

describe("domain events test suite", () => {
  describe("unit test suite", () => {
    let domainEvents = null;
    let eventName = null;
    let listener = null;

    beforeEach(() => {
      domainEvents = require("./domain-events");
      eventName = "TEST_EXECUTED";
    });

    afterEach(() => {
      domainEvents.ignore(listener);
    });

    it("should execute listener if listening", () => {
      const event = {
        eventName,
        value: 1
      };
      listener = {
        eventName,
        respond: (x) => {
          expect(x)
            .to
            .equal(event);
          return Promise.resolve();
        }
      };
      domainEvents.listen(listener);
      domainEvents.notify(event);
    });

    it("should not execute listener if it is ignored", () => {
      const event = {
        eventName
      };
      listener = {
        eventName,
        respond: () => {
          throw new Error("This point should not be reached.");
        }
      };
      domainEvents.listen(listener);
      domainEvents.ignore(listener);
      domainEvents.notify(event);
    });

    it("should execute multiple listeners", () => {
      const event = {
        eventName,
        value: 1
      };
      listener = {
        eventName,
        respond: (x) => {
          expect(x)
            .to
            .equal(event);
          return Promise.resolve();
        }
      };
      domainEvents.listen(listener);
      const secondListener = {
        eventName,
        respond: (x) => {
          expect(x)
            .to
            .equal(event);
          return Promise.resolve();
        }
      };
      domainEvents.listen(secondListener);
      domainEvents.notify(event);
      domainEvents.ignore(secondListener);
    });

    it("should report an error if a notified event doesn't have a name",
      async() => {
        const event = {};
        try {
          await domainEvents.notify(event);
        } catch (error) {
          expect(error)
            .to
            .be
            .ok;
        }
      });

    it("should not report an error if an ignored event doesn't have a name",
      () => {
        const listener = {};
        try {
          domainEvents.ignore(listener);
          expect(true)
            .to
            .equal(true);
        } catch (error) {
          throw new Error("This point should not be reached.");
        }
      });

    it("should report an error if a listener doesn't have a name", () => {
      const listener = {
        respond: () => {}
      };
      try {
        domainEvents.listen(listener);
      } catch (error) {
        expect(error)
          .to
          .be
          .ok;
      }
    });

    it("should report an error if a listener doesn't have respond", () => {
      const listener = {
        eventName
      };
      try {
        domainEvents.listen(listener);
      } catch (error) {
        expect(error)
          .to
          .be
          .ok;
      }
    });

    it("should not attempt to ignore a listener if it isn't listening", () => {
      listener = {
        eventName
      };
      domainEvents.ignore(listener);
    });
  });
});
