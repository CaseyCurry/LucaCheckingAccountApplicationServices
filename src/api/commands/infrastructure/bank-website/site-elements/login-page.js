"use strict";

const axios = require("axios");
const secureConfig = require("./secure-config");

module.exports.login = async(credentials, host, userAgent) => {
  const formattedCredentials = formatCredentials(credentials);
  const path = secureConfig.transactionsPath;
  const config = {
    headers: {
      "Cookie": `${secureConfig.cookieName}=${secureConfig.cookieValue}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": formattedCredentials.length,
      "User-Agent": userAgent
    }
  };
  const response = await axios
    .post(`https://${host}/${path}`, formattedCredentials, config);
  const cookies = response
    .headers["set-cookie"]
    .map(cookie => cookie.split(";")[0])
    .filter(cookie => cookie !== "Q2Online=")
    .slice(1);
  cookies.push(`${secureConfig.cookieName}=${secureConfig.cookieValue}`);
  return cookies.join(";");
};

const formatCredentials = (credentials) => {
  const userId = credentials.userId;
  const password = encodeURIComponent(credentials.password)
    .replace(/[!'()]/g, escape);
  return `user_id=${userId}&password=${password}&submit=`;
};
