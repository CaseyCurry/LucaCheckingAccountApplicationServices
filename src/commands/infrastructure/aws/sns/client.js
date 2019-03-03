import AWS from "aws-sdk";

const options = process.env.IS_OFFLINE
  ? { endpoint: new AWS.Endpoint("http://localhost:9002") }
  : {};
const client = new AWS.SNS(options);

export { client };
