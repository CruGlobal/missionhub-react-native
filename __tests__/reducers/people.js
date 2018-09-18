import people from '../../src/reducers/people';
import {
  DELETE_PERSON,
  LOAD_PERSON_DETAILS,
  PEOPLE_WITH_ORG_SECTIONS,
  UPDATE_PERSON_ATTRIBUTES,
  GET_ORGANIZATION_PEOPLE,
} from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';

const orgId = '100';
const orgs = {
  [orgId]: {
    id: orgId,
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

const org1Id = '123';
const org2Id = '234';
const org3Id = '345';
const person1Id = '1';
const person2Id = '2';
const person3Id = '3';
const person4Id = '4';

const existingPerson1 = { id: person1Id, name: 'Sam' };
const existingPerson2 = { id: person2Id, name: 'Fred' };

const newPerson1 = { id: person1Id, name: 'Sammy' };
const newPerson2 = {
  id: person2Id,
  organizational_permissions: [{ id: '111' }],
};
const newPerson3 = { id: person3Id, name: 'Peter' };
const newPerson4 = { id: person4Id, name: 'Paul' };

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
  const existingPeople = {
    [person1Id]: existingPerson1,
    [person2Id]: existingPerson2,
  };
  const newPeople = [newPerson1, newPerson2, newPerson3, newPerson4];

  const state = people(
    { allByOrg: { [org1Id]: { people: existingPeople } } },
    {
      type: GET_ORGANIZATION_PEOPLE,
      response: newPeople,
      orgId: org1Id,
    },
  );

  expect(state.allByOrg).toEqual({
    [org1Id]: {
      people: {
        [person1Id]: newPerson1,
        [person2Id]: {
          id: person2Id,
          name: existingPerson2.name,
          organizational_permissions: newPerson2.organizational_permissions,
        },
        [person3Id]: newPerson3,
        [person4Id]: newPerson4,
      },
    },
  });
});

it('should save new people in new org', () => {
  const newPeople = [newPerson1, newPerson2, newPerson3, newPerson4];

  const state = people(
    { allByOrg: {} },
    {
      type: GET_ORGANIZATION_PEOPLE,
      response: newPeople,
      orgId: org1Id,
    },
  );

  expect(state.allByOrg).toEqual({
    [org1Id]: {
      people: {
        [person1Id]: newPerson1,
        [person2Id]: newPerson2,
        [person3Id]: newPerson3,
        [person4Id]: newPerson4,
      },
    },
  });
});

it('should save new people and update existing people from steps', () => {
  const existingOrgs = {
    [org1Id]: { people: { [person1Id]: existingPerson1 } },
    [org2Id]: { people: { [person2Id]: existingPerson2 } },
  };

  const steps = [
    {
      organization: { id: org1Id },
      receiver: newPerson1,
    },
    {
      organization: { id: org2Id },
      receiver: newPerson2,
    },
    {
      organization: { id: org1Id },
      receiver: newPerson3,
    },
    {
      organization: { id: org3Id },
      receiver: newPerson4,
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
        [person1Id]: newPerson1,
        [person3Id]: newPerson3,
      },
    },
    [org2Id]: {
      people: {
        [person2Id]: {
          id: person2Id,
          name: existingPerson2.name,
          organizational_permissions: newPerson2.organizational_permissions,
        },
      },
    },
    [org3Id]: {
      people: {
        [person4Id]: newPerson4,
      },
    },
  });
});

describe('REQUESTS.UPDATE_CONTACT_ASSIGNMENT', () => {
  const organization = { id: '111' };
  const person = { id: '1' };
  const oldContactAssignment = { id: '123', organization, person };
  const newContactAssignment = { ...oldContactAssignment, pathway_stage_id: 1 };

  it('should update existing reverse contact assignment', () => {
    const state = people(
      {
        allByOrg: {
          [organization.id]: {
            id: organization.id,
            people: {
              [person.id]: {
                id: person.id,
                reverse_contact_assignments: [oldContactAssignment],
              },
            },
          },
        },
      },
      {
        type: REQUESTS.UPDATE_CONTACT_ASSIGNMENT.SUCCESS,
        results: {
          response: newContactAssignment,
        },
      },
    );

    expect(state.allByOrg).toEqual({
      [organization.id]: {
        id: organization.id,
        people: {
          [person.id]: {
            id: person.id,
            reverse_contact_assignments: [newContactAssignment],
          },
        },
      },
    });
  });

  it('should add new reverse contact assignment', () => {
    const state = people(
      {
        allByOrg: {
          [organization.id]: {
            id: organization.id,
            people: {
              [person.id]: {
                id: person.id,
              },
            },
          },
        },
      },
      {
        type: REQUESTS.UPDATE_CONTACT_ASSIGNMENT.SUCCESS,
        results: {
          response: newContactAssignment,
        },
      },
    );

    expect(state.allByOrg).toEqual({
      [organization.id]: {
        id: organization.id,
        people: {
          [person.id]: {
            id: person.id,
            reverse_contact_assignments: [newContactAssignment],
          },
        },
      },
    });
  });
});
