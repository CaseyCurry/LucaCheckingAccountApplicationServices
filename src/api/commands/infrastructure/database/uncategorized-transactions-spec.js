"use strict";

const expect = require("chai")
  .expect;
const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");
const UncategorizedTransactions = require("./uncategorized-transactions");
const config = require("./config");

describe("uncategorized transactions test suite", () => {
  describe("unit test suite", () => {
    let mockDatabase = null;

    beforeEach(() => {
      mockDatabase = new AxiosMockAdapter(axios);
    });

    afterEach(() => {
      mockDatabase.restore();
    });

    describe("add test suite", () => {
      it("should add the transaction to the repository", async() => {
        const successStatus = 201;
        const id = "id";
        const dataUrl = `${config.database}/uncategorized-transactions`;
        mockDatabase
          .onPost(dataUrl, {
            transactionId: id
          })
          .reply(successStatus);
        const repository = new UncategorizedTransactions(axios);
        const result = await repository
          .add(id);
        expect(result.status)
          .to
          .equal(successStatus);
      });

      it("should report error if the transaction id is not provided",
        async() => {
          const repository = new UncategorizedTransactions(axios);
          try {
            await repository
              .add();
          } catch (error) {
            expect(error)
              .to
              .be
              .ok;
          }
        });
    });

    describe("remove test suite", () => {
      it("should remove the transaction from the repository", async() => {
        const successStatus = 200;
        const transactionId = "transactionId";
        const documentId = "documentId";
        const revision = "revision";
        const dataUrl = `${config.database}/uncategorized-transactions`;
        const getResults = {
          rows: [{
            id: documentId,
            value: revision
          }]
        };
        mockDatabase
          .onGet(`${dataUrl}/_design/doc/_view/by-transaction-id?key=${transactionId}`)
          .reply(200, getResults);
        mockDatabase
          .onDelete(`${dataUrl}/${documentId}?rev=${revision}`)
          .reply(successStatus);
        const repository = new UncategorizedTransactions(axios);
        const result = await repository
          .remove(transactionId);
        expect(result.length)
          .to
          .equal(1);
        expect(result[0].status)
          .to
          .equal(successStatus);
      });

      it("should report error if the transaction id is not provided",
        async() => {
          const repository = new UncategorizedTransactions(axios);
          try {
            await repository
              .remove();
          } catch (error) {
            expect(error)
              .to
              .be
              .ok;
          }
        });
    });
  });
});
