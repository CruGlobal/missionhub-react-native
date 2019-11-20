const dotenv = require('dotenv');

dotenv.config({ path: process.env.ENVFILE || '.env' });

module.exports = {
  client: {
    service: {
      name: 'missionhub-api',
      url: `${process.env.API_BASE_URL}/apis/graphql`,
    },
  },
};
