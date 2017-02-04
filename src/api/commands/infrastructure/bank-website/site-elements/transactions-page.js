"use strict";

const axios = require("axios");
const secureConfig = require("./secure-config");

module.exports.viewTransactions =
  async(host, userAgent, cookies, token, pageNumber, rowsPerPage) => {
    const path = secureConfig.accountHistoryPath + `${pageNumber}/${rowsPerPage}`;
    const config = {
      headers: {
        "Cookie": cookies,
        "x-csrf": token,
        "Content-Type": "application/json",
        "User-Agent": userAgent
      }
    };
    const response = await axios
      .get(`https://${host}/${path}`, config);
    return response
      .data
      .data
      .transactions;
  };
