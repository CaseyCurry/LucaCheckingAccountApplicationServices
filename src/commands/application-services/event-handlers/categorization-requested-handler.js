// TODO: unit test
const CategorizationRequestedHandler = (
  domainEvents,
  transactionRepository
) => {
  const handler = async event => {
    const transaction = await transactionRepository.getById(
      event.message.transaction.tenantId,
      event.message.transaction.id
    );
    await transaction.categorize(event.message.transaction.categorization);
    await transactionRepository.update(transaction);
    domainEvents.raise(transaction.domainEvents.raisedEvents);
  };

  return {
    register: async () => {
      domainEvents.listenAndHandleOnce(
        "checking-account.categorization-requested",
        handler
      );
    }
  };
};

export { CategorizationRequestedHandler };
