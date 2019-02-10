import { expect } from "chai";
import { CategorizationRecommender } from "./categorization-recommender";

describe("group transactions service suite", () => {
  it("should group a word", () => {
    const word = "NETFLIX";
    const transactions = [
      {
        description: word
      },
      {
        description: word
      }
    ];
    const results = CategorizationRecommender.recommend(transactions);
    expect(results[0].phrase).to.equal(word);
    expect(results[0].transactions.length).to.equal(transactions.length);
  });

  it("should group a phrase", () => {
    const phrase = "NETFLIX MONTHLY";
    const transactions = [
      {
        description: phrase
      },
      {
        description: phrase
      }
    ];
    const results = CategorizationRecommender.recommend(transactions);
    console.log(results);
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
        description: firstPhrase
      },
      {
        description: secondPhrase
      }
    ];
    const results = CategorizationRecommender.recommend(transactions);
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

  it("sort by the highest transaction count", () => {
    const firstPhrase = "NETFLIX";
    const secondPhrase = "ITUNES";
    const transactions = [
      {
        description: firstPhrase
      },
      {
        description: secondPhrase
      },
      {
        description: secondPhrase
      }
    ];
    const results = CategorizationRecommender.recommend(transactions);
    expect(2).to.equal(results.length);
    expect(secondPhrase).to.equal(results[0].phrase);
    expect(firstPhrase).to.equal(results[1].phrase);
  });

  describe("exlusions test suite", () => {
    it("should exclude a phrase", () => {
      const exclusion = "DBT CRD";
      const transactions = [
        {
          description: `${exclusion} ITUNES`
        },
        {
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a word", () => {
      const exclusion = "Card";
      const transactions = [
        {
          description: `${exclusion} ITUNES`
        },
        {
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a number", () => {
      const exclusion = "1234";
      const transactions = [
        {
          description: `${exclusion} ITUNES`
        },
        {
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a date", () => {
      const exclusion = "01/01/2016";
      const transactions = [
        {
          description: `${exclusion} ITUNES`
        },
        {
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a time", () => {
      const exclusion = "12:30";
      const transactions = [
        {
          description: `${exclusion} ITUNES`
        },
        {
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should exclude a word if its length is less than 4", () => {
      const exclusion = "CAL";
      const transactions = [
        {
          description: `${exclusion} ITUNES`
        },
        {
          description: `${exclusion} NETFLIX`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      results.forEach(x => {
        expect(x.phrase).not.to.equal(exclusion);
      });
    });

    it("should include an Ungrouped phrase when all transaction words are excluded", () => {
      const exclusion = "Card";
      const transactions = [
        {
          description: `${exclusion}`
        },
        {
          description: `${exclusion}`
        }
      ];
      const results = CategorizationRecommender.recommend(transactions);
      expect(results[0].phrase).to.equal("Ungrouped");
      expect(results[0].transactions.length).to.equal(transactions.length);
    });
  });
});
