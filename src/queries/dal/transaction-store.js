const TransactionStore = (http, baseUrl) => {
  const url = `${baseUrl}checking-account%2Ftransactions/`;
  return {
    url,
    http
  };
};

export { TransactionStore };
