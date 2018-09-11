import people from '../../src/reducers/people';
import {
  DELETE_PERSON,
  LOAD_PERSON_DETAILS,
  PEOPLE_WITH_ORG_SECTIONS,
  UPDATE_PERSON_ATTRIBUTES,
} from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';

const orgs = {
  '100': {
    id: '100',
    name: 'Test Org',
    people: {
      '1': { id: '1' },
      '2': { id: '2', first_name: 'Fname', last_name: 'Lname' },
    },
  },
  personal: {
    id: 'personal',
    people: {
      '2': { id: '2', first_name: 'Fname', last_name: 'Lname' },
      '3': { id: '3' },
    },
  },
};

it('should replace a person in allByOrg when it is loaded with more includes', () => {
  const state = people(
    {
      allByOrg: orgs,
    },
    {
      type: LOAD_PERSON_DETAILS,
      person: { id: '2', first_name: 'Test Person' },
    },
  );

  expect(state.allByOrg).toMatchSnapshot();
});

it('should add an org for a person in allByOrg when it is loaded and the org does not exist', () => {
  const state = people(
    {
      allByOrg: orgs,
    },
    {
      type: LOAD_PERSON_DETAILS,
      person: { id: '2', first_name: 'Test Person' },
      orgId: '105',
      org: { id: '105', name: 'test org 1' },
    },
  );

  expect(state.allByOrg).toMatchSnapshot();
});

it('should add a person to an org in allByOrg when it is loaded and the person in that org does not exist', () => {
  const state = people(
    {
      allByOrg: orgs,
    },
    {
      type: LOAD_PERSON_DETAILS,
      person: { id: '4', first_name: 'Test Person' },
      orgId: '100',
      org: { id: '100', name: 'test org 2' },
    },
  );

  expect(state.allByOrg).toMatchSnapshot();
});

it('should update attributes of a person in allByOrg ', () => {
  const state = people(
    {
      allByOrg: orgs,
    },
    {
      type: UPDATE_PERSON_ATTRIBUTES,
      updatedPersonAttributes: { id: '2', first_name: 'Test Person' },
    },
  );

  expect(state.allByOrg).toMatchSnapshot();
});

it('should delete a person from allByOrg ', () => {
  const state = people(
    {
      allByOrg: orgs,
    },
    {
      type: DELETE_PERSON,
      personId: '2',
      personOrgId: '100',
    },
  );

  expect(state.allByOrg).toMatchSnapshot();
});

it('should save people allByOrg', () => {
  const state = people(
    {},
    {
      type: PEOPLE_WITH_ORG_SECTIONS,
      orgs: orgs,
    },
  );

  expect(state.allByOrg).toEqual(orgs);
});

it('should save new people and update existing people', () => {
  const orgId = '123';
  const existingPeople = {
    '1': { id: '1', name: 'Sam' },
    '2': { id: '2', name: 'Fred' },
  };
  const newPeople = [
    { id: '1', name: 'Sammy' },
    { id: '2', organizational_permissions: [{ id: '111' }] },
    { id: '3', name: 'Peter' },
    { id: '4', name: 'Paul' },
  ];

  const state = people(
    { allByOrg: { [orgId]: { people: existingPeople } } },
    {
      type: REQUESTS.GET_PEOPLE_LIST.SUCCESS,
      results: {
        response: newPeople,
      },
      query: { filters: { organization_ids: orgId } },
    },
  );

  expect(state.allByOrg).toEqual({
    [orgId]: {
      people: {
        '1': {
          id: '1',
          name: 'Sammy',
        },
        '2': {
          id: '2',
          name: 'Fred',
          organizational_permissions: [{ id: '111' }],
        },
        '3': {
          id: '3',
          name: 'Peter',
        },
        '4': {
          id: '4',
          name: 'Paul',
        },
      },
    },
  });
});

it('should save new people and update existing people from steps', () => {
  const org1Id = '123';
  const org2Id = '234';
  const person1Id = '1';
  const person2Id = '2';
  const person3Id = '3';
  const person4Id = '4';

  const person1 = { id: person1Id, name: 'Sam' };
  const person2 = { id: person2Id, name: 'Fred' };

  const existingOrgs = {
    [org1Id]: { people: { [person1.id]: person1 } },
    [org2Id]: { people: { [person2.id]: person2 } },
  };

  const steps = [
    {
      organization: { id: org1Id },
      receiver: { id: person1Id, name: 'Sammy' },
    },
    {
      organization: { id: org2Id },
      receiver: { id: person2Id, organizational_permissions: [{ id: '111' }] },
    },
    {
      organization: { id: org1Id },
      receiver: { id: person3Id, name: 'Peter' },
    },
    {
      organization: { id: org2Id },
      receiver: { id: person4Id, name: 'Paul' },
    },
  ];

  const state = people(
    { allByOrg: existingOrgs },
    {
      type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
      results: {
        response: steps,
      },
    },
  );

  expect(state.allByOrg).toEqual({
    [org1Id]: {
      people: {
        [person1Id]: {
          id: person1Id,
          name: 'Sammy',
        },
        [person3Id]: {
          id: person3Id,
          name: 'Peter',
        },
      },
    },
    [org2Id]: {
      people: {
        [person2Id]: {
          id: person2Id,
          name: 'Fred',
          organizational_permissions: [{ id: '111' }],
        },
        [person4Id]: {
          id: person4Id,
          name: 'Paul',
        },
      },
    },
  });
});
