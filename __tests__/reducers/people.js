import people from '../../src/reducers/people';
import {
  DELETE_PERSON,
  LOAD_PERSON_DETAILS,
  PEOPLE_WITH_ORG_SECTIONS,
  UPDATE_PERSON_ATTRIBUTES,
} from '../../src/constants';

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
