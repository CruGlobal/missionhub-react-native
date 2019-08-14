jest.mock('../src/apolloClient', () => ({
  apolloClient: require('../testUtils/apolloMockClient').createApolloMockClient(),
}));
