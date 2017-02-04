"use strict";

const expect = require("chai")
  .expect;
const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");
const Transactions = require("./transactions");
const config = require("./config");
const dataUrl = `${config.database}/transactions`;

describe("transactions test suite", () => {
  describe("unit test suite", () => {
    let mockDatabase = null;

    beforeEach(() => {
      mockDatabase = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
      mockDatabase.restore();
    });

    describe("get transaction by id test suite", () => {
      it("should get if only a single posted event exists", async() => {
        const id = "id";
        const response = {
          rows: [{
            value: {
              timeOccurred: 0,
              transaction: {
                id
              }
            }
          }]
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-id?key=${id}`)
          .reply(200, response);
        const repository = new Transactions(axios);
        const transaction = await repository
          .getById(id);
        expect(transaction.id)
          .to
          .equal(id);
      });

      it("should get null if the transaction does not exist", async() => {
        const id = "id";
        const response = {
          rows: []
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-id?key=${id}`)
          .reply(200, response);
        const repository = new Transactions(axios);
        const transaction = await repository
          .getById(id);
        expect(transaction)
          .not
          .to
          .be
          .ok;
      });

      it("should get if it has been categorized", async() => {
        const id = "id";
        const categorization = "categorization";
        const response = {
          rows: [{
            value: {
              timeOccurred: 0,
              transaction: {
                id
              }
            }
          }, {
            value: {
              timeOccurred: 0,
              transaction: {
                id,
                categorization
              }
            }
          }]
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-id?key=${id}`)
          .reply(200, response);
        const repository = new Transactions(axios);
        const transaction = await repository
          .getById(id);
        expect(transaction.id)
          .to
          .equal(id);
        expect(transaction.categorization)
          .to
          .equal(categorization);
      });

      it("should get the most recent categorization", async() => {
        const id = "id";
        const firstCategorization = "firstCategorization";
        const firstCategorizationTimeOccurred = 1;
        const secondCategorization = "secondCategorization";
        const secondCategorizationTimeOccurred = 2;
        const response = {
          rows: [{
            value: {
              timeOccurred: 0,
              transaction: {
                id
              }
            }
          }, {
            value: {
              timeOccurred: secondCategorizationTimeOccurred,
              transaction: {
                id,
                categorization: secondCategorization
              }
            }
          }, {
            value: {
              timeOccurred: firstCategorizationTimeOccurred,
              transaction: {
                id,
                categorization: firstCategorization
              }
            }
          }]
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-id?key=${id}`)
          .reply(200, response);
        const repository = new Transactions(axios);
        const transaction = await repository
          .getById(id);
        expect(transaction.id)
          .to
          .equal(id);
        expect(transaction.categorization)
          .to
          .equal(secondCategorization);
      });
    });

    describe("post test suite", () => {
      it("should add the transaction to the repository", async() => {
        const successStatus = 201;
        const transaction = {};
        const event = {
          transaction
        };
        mockDatabase
          .onPost(dataUrl, event)
          .reply(successStatus);
        const repository = new Transactions(axios);
        const result = await repository
          .post(event);
        expect(result.status)
          .to
          .equal(successStatus);
      });

      it("should report error if the transaction is not provided", async() => {
        const repository = new Transactions(axios);
        try {
          await repository.post();
        } catch (error) {
          expect(error)
            .to
            .be
            .ok;
        }
      });
    });

    describe("categorize test suite", () => {
      describe("successfully add event test suite", () => {
        const successStatus = 201;
        const transaction = {
          id: "id",
          categorization: "categorization",
          date: "date"
        };
        const event = {
          transaction
        };
        const repository = new Transactions(axios);

        beforeEach(() => {
          mockDatabase
            .onAny()
            .reply(successStatus);
        });

        it("should add the transaction to the repository", async() => {
          const result = await repository
            .categorize(event);
          expect(result.status)
            .to
            .equal(successStatus);
        });
      });

      it("should report error if the transaction is not provided", async() => {
        const repository = new Transactions(axios);
        try {
          await repository.categorize();
        } catch (error) {
          expect(error)
            .to
            .be
            .ok;
        }
      });
    });

    it("should find latest transaction date in the repository", async() => {
      const viewUrl =
        `${dataUrl}/_design/doc/_view/posted-by-date?descending=true&limit=1`;
      const latestTransactionDate = new Date()
        .getTime();
      const response = {
        rows: [{
          key: latestTransactionDate
        }]
      };
      mockDatabase
        .onGet(viewUrl)
        .reply(200, response);
      const repository = new Transactions(axios);
      const date = await repository
        .findLatestTransactionDate();
      expect(date)
        .to
        .equal(latestTransactionDate);
    });

    it("should not find latest transaction date if it doesn't exist",
      async() => {
        const viewUrl =
          `${dataUrl}/_design/doc/_view/posted-by-date?descending=true&limit=1`;
        const response = {
          rows: []
        };
        mockDatabase
          .onGet(viewUrl)
          .reply(200, response);
        const repository = new Transactions(axios);
        const date = await repository
          .findLatestTransactionDate();
        expect(date)
          .not
          .to
          .be
          .ok;
      });
  });
});
