import faker from 'faker/locale/en';
import { IMocks } from 'graphql-tools';
import moment from 'moment';

import {
  CommunityCelebrationCelebrateableEnum,
  PermissionEnum,
  ReminderTypeEnum,
  StepTypeEnum,
} from '../__generated__/globalTypes';

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
  ISO8601DateTime: () => faker.date.past(10, '2020-01-14').toISOString(),
  ISO8601Date: () =>
    moment(faker.date.past(10, '2020-01-14')).format('YYYY-MM-DD'),

  BasePageInfo: () => ({
    endCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
  }),
  ReminderTypeEnum: () => ReminderTypeEnum.once,
  StepTypeEnum: () => faker.random.arrayElement(Object.values(StepTypeEnum)),

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
      celebrateableType: faker.random.arrayElement(
        Object.values(CommunityCelebrationCelebrateableEnum),
      ),
      changedAttributeValue: moment(
        faker.date.past(10, '2020-01-14'),
      ).toISOString(),
      subjectPersonName: `${firstName} ${lastName}`,
    };
  },
  CommunityPermission: () => {
    return {
      permission: faker.random.arrayElement(Object.values(PermissionEnum)),
    };
  },
  FeedItem: () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    return {
      subjectPersonName: `${firstName} ${lastName}`,
    };
  },
};
