jest.mock('../src/apolloClient', () => ({
  apolloClient: require('../testUtils/apolloMockClient').createApolloMockClient(),
  createApolloClient: require('../testUtils/apolloMockClient')
    .createApolloMockClient,
}));
