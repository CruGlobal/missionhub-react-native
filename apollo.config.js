const prod = process.env.TRAVIS_BRANCH === 'master';

module.exports = {
  client: {
    service:
      false && prod // TODO: remove when prod GraphQL API is live. Helps tests pass for now
        ? {
            name: 'production',
            url: 'https://api.missionhub.com/apis/graphql',
          }
        : {
            name: 'staging',
            url: 'https://api-stage.missionhub.com/apis/graphql',
          },
  },
};
