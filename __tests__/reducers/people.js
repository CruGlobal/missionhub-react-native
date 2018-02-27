import people from '../../src/reducers/people';
import { DELETE_PERSON, PEOPLE_WITH_ORG_SECTIONS, UPDATE_PERSON_ATTRIBUTES } from '../../src/constants';
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
  'personal': {
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
      type: REQUESTS.GET_PERSON.SUCCESS,
      results: {
        response: { id: '2', first_name: 'Test Person' },
      },
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
    }
  );

  expect(state.allByOrg).toEqual(orgs);
});
