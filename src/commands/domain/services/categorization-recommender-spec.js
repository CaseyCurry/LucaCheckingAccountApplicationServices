import { expect } from "chai";
import { categorizationRecommender } from "./categorization-recommender";

describe("group transactions service suite", () => {
  it("should group a word", () => {
    const word = "NETFLIX";
    const transactions = [
      {
        id: "123",
        description: word
      },
      {
        id: "456",
        description: word
      }
    ];
    const results = categorizationRecommender.recommend(transactions);
    expect(results[0].phrase).to.equal(word);
    expect(results[0].transactions.length).to.equal(transactions.length);
  });

  it("should group a phrase", () => {
    const phrase = "NETFLIX MONTHLY";
    const transactions = [
      {
        id: "123",
        description: phrase
      },
      {
        id: "456",
        description: phrase
      }
    ];
    const results = categorizationRecommender.recommend(transactions);
    expect(results[0].phrase).to.equal(phrase);
    expect(results[0].transactions.length).to.equal(transactions.length);
  });

  it("merge common phrases", () => {
    const common = "NETFLIX";
    const firstExtension = "MONTHLY";
    const firstPhrase = `${common} ${firstExtension}`;
    const secondExtension = "ANNUAL";
    const secondPhrase = `${common} ${secondExtension}`;
    const transactions = [
      {
        id: "123",
        description: firstPhrase
      },
      {
        id: "456",
        description: secondPhrase
      }
    ];
    const results = categorizationRecommender.recommend(transactions);
    expect(3).to.equal(results.length);
    results.forEach(x => {
      if (x.phrase === common) {
        expect(transactions.length).to.equal(x.transactions.length);
      } else if (x.phrase === firstExtension) {
        expect(1).to.equal(x.transactions.length);
      } else if (x.phrase === secondExtension) {
        expect(1).to.equal(x.transactions.length);
      } else {
        expect("INVALID").to.equal(x.phrase);
      }
    });
  });

  describe("exlusions test suite", () => {
    it("should exclude a phrase", () => {
      const exclusion = "DBT CRD";
      const transactions = [
        {
          id: "123",
          description: `${exclusion} ITUNES`
        },
        {
          id: "456",
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a word", () => {
      const exclusion = "Card";
      const transactions = [
        {
          id: "123",
          description: `${exclusion} ITUNES`
        },
        {
          id: "456",
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a number", () => {
      const exclusion = "1234";
      const transactions = [
        {
          id: "123",
          description: `${exclusion} ITUNES`
        },
        {
          id: "456",
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a date", () => {
      const exclusion = "01/01/2016";
      const transactions = [
        {
          id: "123",
          description: `${exclusion} ITUNES`
        },
        {
          id: "456",
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a time", () => {
      const exclusion = "12:30";
      const transactions = [
        {
          id: "123",
          description: `${exclusion} ITUNES`
        },
        {
          id: "456",
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a word if its length is less than 3", () => {
      const exclusion = "CJ";
      const transactions = [
        {
          id: "123",
          description: `${exclusion} ITUNES`
        },
        {
          id: "456",
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should include an Ungrouped phrase when all transaction words are excluded", () => {
      const exclusion = "Card";
      const transactions = [
        {
          id: "123",
          description: `${exclusion}`
        },
        {
          id: "456",
          description: `${exclusion}`
        }
      ];
      const results = categorizationRecommender.recommend(transactions);
      expect(results[0].phrase).to.equal("Ungrouped");
      expect(results[0].transactions.length).to.equal(transactions.length);
    });
  });
});
