// TODO: unit test
const TransactionSplitHandler = (domainEvents, transactionRepository) => {
  const handler = async event => {
    await transactionRepository.create(event.message.newTransaction);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce(
        "checking-account.transaction-split",
        handler
      );
    }
  };
};

export { TransactionSplitHandler };
