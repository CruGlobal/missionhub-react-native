const dotenv = require('dotenv');

const result = dotenv.config({
  path: process.env.ENVFILE || `${__dirname}/.env`,
});

if (result.error) {
  throw result.error;
}

module.exports = {
  client: {
    service: {
      name: 'missionhub-api',
      url: `${process.env.API_BASE_URL}/apis/graphql`,
    },
  },
};
