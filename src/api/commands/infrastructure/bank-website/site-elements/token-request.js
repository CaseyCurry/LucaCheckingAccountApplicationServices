"use strict";

const axios = require("axios");
const secureConfig = require("./secure-config");

module.exports.get = async(host, userAgent, cookies) => {
  const path = secureConfig.tokenPath;
  const config = {
    headers: {
      "Cookie": cookies,
      "Content-Type": "application/json",
      "Content-Length": 2,
      "User-Agent": userAgent
    }
  };
  const response = await axios
    .post(`https://${host}/${path}`, {}, config);
  return response
    .data
    .data
    .token;
};
