const prod = process.env.TRAVIS_BRANCH === 'master';

module.exports = {
  client: {
    service: prod
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
