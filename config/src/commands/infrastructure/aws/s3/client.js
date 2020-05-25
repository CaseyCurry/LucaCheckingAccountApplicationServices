const AWS = require("aws-sdk");

const options = process.env.IS_OFFLINE
  ? {
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint("http://localhost:9001")
  }
  : {
    s3ForcePathStyle: true
  };
const client = new AWS.S3(options);

export { client };
