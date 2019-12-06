import faker from 'faker/locale/en';
import { IMocks } from 'graphql-tools';

import { ReminderTypeEnum } from '../__generated__/globalTypes';

let currentId = 1;
const nextId = () => currentId++;
export const resetGlobalMockSeeds = () => {
  currentId = 1;
  faker.seed(1);
};
resetGlobalMockSeeds();

export const globalMocks: IMocks = {
  String: () => faker.lorem.words(),
  Int: () => faker.random.number(),
  Float: () => faker.random.number({ precision: 0.01 }),
  Boolean: () => faker.random.boolean(),
  ID: () => nextId(),
  ISO8601DateTime: () => faker.date.past(10, '2019-01-01'),

  BasePageInfo: () => ({
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
  }),
  ReminderTypeEnum: () => ReminderTypeEnum.once,

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
};
