import faker from 'faker/locale/en';

let currentId = 1;
const nextId = () => currentId++;
export const resetGlobalMockSeeds = () => {
  currentId = 1;
  faker.seed(1);
};
resetGlobalMockSeeds();

export const globalMocks = {
  String: () => faker.lorem.words(),
  Int: () => faker.random.number(),
  Float: () => faker.random.number({ precision: 0.01 }),
  Boolean: () => faker.random.boolean(),
  ID: () => nextId(),

  AcceptedChallenge: () => ({
    title: faker.hacker.phrase(),
  }),
  Person: () => ({
    fullName: faker.name.findName(),
  }),
};
