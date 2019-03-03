// TODO: unit test
import { Transaction } from "../../../domain/aggregates/transaction";
import { v4 as uuidv4 } from "uuid";

const adaptTransaction = (tenantId, line) => {
  // Example line...
  // "XXXXXX9409",1/8/2019,,"Pre auth STARBUCKS STORE LOC: NASHVILLE TN",16.61,,Pending,141577.70
  const id = uuidv4();
  const properties = line.split(",");
  const account = cleanseProperty(properties[0]);
  const date = new Date(properties[1]);
  const description =
    properties.length === 8
      ? cleanseProperty(properties[3])
      : properties
        .map(property => {
          /* Get all of the property values in between a certain range of
             indexes. This is to protect against the case where the 
             description has commas / delimiters which would throw off
             the expected property locations. */
          const propertyIndex = properties.indexOf(property);
          if (propertyIndex >= 3 && propertyIndex <= properties.length - 4) {
            return property;
          } else {
            return "";
          }
        })
        .reduce((x, y) => cleanseProperty(x + " " + y));
  const depositIndex = properties.length - 3;
  let amount;
  let isDeposit;
  if (properties[depositIndex]) {
    amount = parseFloat(properties[depositIndex]);
    isDeposit = true;
  } else {
    amount = parseFloat(properties[depositIndex - 1]);
    isDeposit = false;
  }
  return new Transaction({
    id,
    tenantId,
    account,
    date,
    description,
    amount,
    isDeposit
  });
};

const cleanseProperty = value => {
  return value
    .split("\"")
    .join("")
    .replace(/ +(?= )/g, "");
};

export { adaptTransaction };
