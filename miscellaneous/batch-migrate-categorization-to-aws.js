import { CategorizationRequestedEvent } from "../src/commands/domain/events/categorization-requested-event";
import fs from "fs";
// const allTransactions = require("./all-transaction.json");
const allTransactions = require("./manual-maps.json");
const AWS = require("aws-sdk");

const categories = [
  {
    name: "income",
    subcategories: [
      {
        id: "af15ae16-31ff-11e9-b210-d663bd873d93",
        name: "salary/bonus"
      },
      {
        id: "af15b0aa-31ff-11e9-b210-d663bd873d93",
        name: "interest"
      },
      {
        id: "af15b1fe-31ff-11e9-b210-d663bd873d93",
        name: "royalties"
      },
      {
        id: "af15b33e-31ff-11e9-b210-d663bd873d93",
        name: "dividends"
      },
      {
        id: "af15b8c0-31ff-11e9-b210-d663bd873d93",
        name: "rent"
      },
      {
        id: "af15ba3c-31ff-11e9-b210-d663bd873d93",
        name: "sell of asset"
      }
    ]
  },
  {
    name: "investments",
    subcategories: [
      {
        id: "2816b6fc-3200-11e9-b210-d663bd873d93",
        name: "commodities"
      },
      {
        id: "2816b986-3200-11e9-b210-d663bd873d93",
        name: "stocks"
      },
      {
        id: "2816bad0-3200-11e9-b210-d663bd873d93",
        name: "401k"
      },
      {
        id: "2816bc10-3200-11e9-b210-d663bd873d93",
        name: "real estate"
      }
    ]
  },
  {
    name: "housing",
    subcategories: [
      {
        id: "9e180266-3200-11e9-b210-d663bd873d93",
        name: "mortgage"
      },
      {
        id: "9e17f06e-3200-11e9-b210-d663bd873d93",
        name: "rent"
      },
      {
        id: "9e17f406-3200-11e9-b210-d663bd873d93",
        name: "phone"
      },
      {
        id: "9e17f564-3200-11e9-b210-d663bd873d93",
        name: "internet"
      },
      {
        id: "9e17f6a4-3200-11e9-b210-d663bd873d93",
        name: "cable"
      },
      {
        id: "9e17f7e4-3200-11e9-b210-d663bd873d93",
        name: "electricity"
      },
      {
        id: "9e17f91a-3200-11e9-b210-d663bd873d93",
        name: "water"
      },
      {
        id: "9e17fc26-3200-11e9-b210-d663bd873d93",
        name: "gas"
      },
      {
        id: "9e17fd7a-3200-11e9-b210-d663bd873d93",
        name: "insurance/taxes"
      },
      {
        id: "9e17feb0-3200-11e9-b210-d663bd873d93",
        name: "renovation/maintenance"
      },
      {
        id: "9e17ffe6-3200-11e9-b210-d663bd873d93",
        name: "storage"
      },
      {
        id: "9e18011c-3200-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "transportation",
    subcategories: [
      {
        id: "2be1ad72-3201-11e9-b210-d663bd873d93",
        name: "car note/lease"
      },
      {
        id: "2be1b010-3201-11e9-b210-d663bd873d93",
        name: "insurance"
      },
      {
        id: "2be1b16e-3201-11e9-b210-d663bd873d93",
        name: "fuel"
      },
      {
        id: "2be1b542-3201-11e9-b210-d663bd873d93",
        name: "maintenance"
      },
      {
        id: "2be1b808-3201-11e9-b210-d663bd873d93",
        name: "public transport"
      },
      {
        id: "2be1b97a-3201-11e9-b210-d663bd873d93",
        name: "tolls/parking"
      },
      {
        id: "2be1baba-3201-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "food",
    subcategories: [
      {
        id: "7ddcc2ec-3201-11e9-b210-d663bd873d93",
        name: "restaraunt"
      },
      {
        id: "7ddcc2ec-3201-11e9-b210-d663bd873d93",
        name: "restaurant"
      },
      {
        id: "7ddcc594-3201-11e9-b210-d663bd873d93",
        name: "groceries"
      },
      {
        id: "7ddcc6e8-3201-11e9-b210-d663bd873d93",
        name: "fast-food"
      },
      {
        id: "7ddcc832-3201-11e9-b210-d663bd873d93",
        name: "coffee"
      },
      {
        id: "7ddccbca-3201-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "recreation",
    subcategories: [
      {
        id: "c665f880-3201-11e9-b210-d663bd873d93",
        name: "bar"
      },
      {
        id: "c665fd08-3201-11e9-b210-d663bd873d93",
        name: "dating"
      },
      {
        id: "c665feac-3201-11e9-b210-d663bd873d93",
        name: "music & movies"
      },
      {
        id: "c666000a-3201-11e9-b210-d663bd873d93",
        name: "books"
      },
      {
        id: "c6660294-3201-11e9-b210-d663bd873d93",
        name: "hiking"
      },
      {
        id: "c66605fa-3201-11e9-b210-d663bd873d93",
        name: "photography"
      },
      {
        id: "c666074e-3201-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "clothing",
    subcategories: [
      {
        id: "3851a829-6c35-45e5-bade-a6a6a31270b7",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "travel",
    subcategories: [
      {
        id: "ecf1454e-bcde-4070-9975-ddc53200613d",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "professional",
    subcategories: [
      {
        id: "6f5b7dc0-3202-11e9-b210-d663bd873d93",
        name: "training"
      },
      {
        id: "6f5b82c0-3202-11e9-b210-d663bd873d93",
        name: "computer equipment"
      },
      {
        id: "6f5b845a-3202-11e9-b210-d663bd873d93",
        name: "software licences/subscriptions"
      },
      {
        id: "6f5b859a-3202-11e9-b210-d663bd873d93",
        name: "cloud services"
      },
      {
        id: "6f5b86d0-3202-11e9-b210-d663bd873d93",
        name: "cleaners"
      },
      {
        id: "6f5b8810-3202-11e9-b210-d663bd873d93",
        name: "travel"
      },
      {
        id: "6f5b893c-3202-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "credit",
    subcategories: [
      {
        id: "b6a69d2c-3202-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "health",
    subcategories: [
      {
        id: "c666015e-3201-11e9-b210-d663bd873d93",
        name: "gym"
      },
      {
        id: "0f53d5fa-6690-4e17-b7ac-488d1dee8b40",
        name: "vision"
      },
      {
        id: "b6a69fca-3202-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  },
  {
    name: "miscellaneous",
    subcategories: [
      {
        id: "b6a6a128-3202-11e9-b210-d663bd873d93",
        name: "miscellaneous"
      }
    ]
  }
];

const transactions = allTransactions.map(x => (x.doc ? x.doc : x));
// const transactions = allTransactions.slice(0, 1).map(x => x.doc);

const events = [];

const manualMapFile = `./miscellaneous/logs/manual-map.${new Date().toISOString()}.json`;
fs.appendFile(manualMapFile, "[", error => {
  if (error) console.error(error);
});

transactions.forEach(transaction => {
  if (typeof transaction.categorization !== "string") {
    let categorization;
    const category = categories.find(
      x => x.name === transaction.categorization.category
    );
    if (category) {
      const subcategory = category.subcategories.find(
        x => x.name === transaction.categorization.subcategory
      );
      if (subcategory) {
        categorization = subcategory.id;
      }
    }
    if (!categorization) {
      // TODO: manually map transactions written to this file
      fs.appendFile(manualMapFile, `${JSON.stringify(transaction)},`, error => {
        if (error) console.error(error);
      });
    } else {
      events.push(
        new CategorizationRequestedEvent(
          transaction.id,
          transaction.tenantId,
          categorization
        )
      );
    }
  }
});

fs.appendFile(manualMapFile, "]", error => {
  if (error) console.error(error);
});

AWS.config.update({ region: "us-west-2" });
const client = new AWS.SNS({});

const domainEvents = {
  raise: event => {
    const arn =
      "arn:aws:sns:us-west-2:741431045153:dev-luca-checking-acct-app-svcs-categorization-requested";
    const message = {
      Message: JSON.stringify(event),
      TopicArn: arn
    };
    // console.log(message);
    // return Promise.resolve();
    return client.publish(message).promise();
  }
};

const failures = `./miscellaneous/logs/failures-categorization.${new Date().toISOString()}.json`;
fs.appendFile(failures, "[", error => {
  if (error) console.error(error);
});

console.log("event count:", events.length);

let publishCount = 0;

const timer = setInterval(() => {
  if (!events.length) {
    clearInterval(timer);
    fs.appendFile(failures, "]", error => {
      if (error) console.log(error);
      console.log("publish count:", publishCount);
    });
  } else {
    publishCount++;
    const event = events.splice(0, 1)[0];
    domainEvents.raise(event).catch(error => {
      if (error) {
        console.error(error.message);
        fs.appendFile(failures, `${JSON.stringify(event)},`, error => {
          if (error) console.error(error);
        });
      }
    });
  }
}, 50);
