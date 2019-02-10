// TODO: unit test
const TransactionImportedHandler = (domainEvents, transactionRepository) => {
  const handler = async event => {
    await transactionRepository.create(event.message.transaction);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce(
        "checking-account.transaction-imported",
        handler
      );
    }
  };
};

export { TransactionImportedHandler };
