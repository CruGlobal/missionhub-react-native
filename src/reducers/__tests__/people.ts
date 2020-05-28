import people from '../people';
import {
  DELETE_PERSON,
  LOAD_PERSON_DETAILS,
  PEOPLE_WITH_ORG_SECTIONS,
  UPDATE_PERSON_ATTRIBUTES,
  GET_ORGANIZATION_PEOPLE,
} from '../../constants';

const peopleArray = {
  '1': { id: '1' },
  '2': { id: '2', first_name: 'Fname', last_name: 'Lname' },
  '3': { id: '3' },
};

const org1Id = '123';
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

it('should replace a person when it is loaded with more includes', () => {
  const state = people(
    {
      people: peopleArray,
    },
    {
      type: LOAD_PERSON_DETAILS,
      person: { id: '2', first_name: 'Test Person' },
    },
  );

  expect(state.people).toMatchSnapshot();
});

it('should add a person when it is loaded and the person does not exist', () => {
  const state = people(
    {
      people: peopleArray,
    },
    {
      type: LOAD_PERSON_DETAILS,
      person: { id: '4', first_name: 'Test Person' },
    },
  );

  expect(state.people).toMatchSnapshot();
});

it('should update attributes of a person ', () => {
  const state = people(
    {
      people: peopleArray,
    },
    {
      type: UPDATE_PERSON_ATTRIBUTES,
      updatedPersonAttributes: { id: '2', first_name: 'Test Person' },
    },
  );

  expect(state.people).toMatchSnapshot();
});

it('should delete a person ', () => {
  const state = people(
    {
      people: peopleArray,
    },
    {
      type: DELETE_PERSON,
      personId: '2',
    },
  );

  expect(state.people).toMatchSnapshot();
});

it('should save people', () => {
  const state = people(
    // @ts-ignore
    {},
    {
      type: PEOPLE_WITH_ORG_SECTIONS,
      response: Object.values(peopleArray),
    },
  );

  expect(state.people).toEqual(peopleArray);
});

it('should save new people and update existing people', () => {
  const existingPeople = {
    [person1Id]: existingPerson1,
    [person2Id]: existingPerson2,
  };
  const newPeople = [newPerson1, newPerson2, newPerson3, newPerson4];

  const state = people(
    { people: existingPeople },
    {
      type: GET_ORGANIZATION_PEOPLE,
      response: newPeople,
      orgId: org1Id,
    },
  );

  expect(state.people).toEqual({
    [person1Id]: newPerson1,
    [person2Id]: {
      id: person2Id,
      name: existingPerson2.name,
      organizational_permissions: newPerson2.organizational_permissions,
    },
    [person3Id]: newPerson3,
    [person4Id]: newPerson4,
  });
});
