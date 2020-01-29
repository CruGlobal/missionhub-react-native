import faker from 'faker/locale/en';
import { IMocks } from 'graphql-tools';
import moment from 'moment';

import { CELEBRATEABLE_TYPES } from '../src/constants';

let currentId = 1;
const nextId = () => currentId++;
export const resetGlobalMockSeeds = () => {
  currentId = 1;
  faker.seed(1);
};
resetGlobalMockSeeds();

const validCelebrateableTypes = [
  CELEBRATEABLE_TYPES.completedStep,
  CELEBRATEABLE_TYPES.acceptedCommunityChallenge,
  CELEBRATEABLE_TYPES.createdCommunity,
  CELEBRATEABLE_TYPES.joinedCommunity,
  CELEBRATEABLE_TYPES.story,
];

export const globalMocks: IMocks = {
  String: () => faker.lorem.words(),
  Int: () => faker.random.number(),
  Float: () => faker.random.number({ precision: 0.01 }),
  Boolean: () => faker.random.boolean(),
  ID: () => nextId(),
  ISO8601DateTime: () => faker.date.past(10, '2020-01-14').toUTCString(),
  ISO8601Date: () =>
    moment(faker.date.past(10, '2020-01-14')).format('YYYY-MM-DD'),

  BasePageInfo: () => ({
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
  }),
  Step: () => ({
    title: faker.lorem.sentence(),
  }),
  Person: () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    return {
      fullName: `${firstName} ${lastName}`,
      firstName,
      lastName,
    };
  },
  Community: () => ({
    name: faker.company.catchPhrase(),
  }),
  CommunityCelebrationItem: () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    return {
      celebrateableType: faker.random.arrayElement(validCelebrateableTypes),
      changedAttributeValue: moment(faker.date.past(10, '2020-01-14')).format(
        'YYYY-MM-DDTHH:mm:ss:SS',
      ),
      subjectPersonName: `${firstName} ${lastName}`,
    };
  },
};
