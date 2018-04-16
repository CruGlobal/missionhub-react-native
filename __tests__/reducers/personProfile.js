import personProfile from '../../src/reducers/personProfile';
import { REQUESTS } from '../../src/actions/api';
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, UPDATE_ONBOARDING_PERSON, RESET_ONBOARDING_PERSON } from '../../src/constants';

const person = {
  id: '1',
  first_name: 'test',
  last_name: 'test last',
  reverse_contact_assignments: [
    {
      id: '2',
    },
  ],
};

it('updates from API call', () => {
  const state = personProfile(
    {},
    {
      type: REQUESTS.ADD_NEW_PERSON.SUCCESS,
      results: {
        response: person,
      },
    }
  );

  expect(state.id).toBe(person.id);
  expect(state.personFirstName).toBe(person.first_name);
  expect(state.personLastName).toBe(person.last_name);
  expect(state.contactAssignmentId).toBe(person.reverse_contact_assignments[0].id);
});

it('updates from update API call', () => {
  const state = personProfile(
    {},
    {
      type: UPDATE_ONBOARDING_PERSON,
      results: {
        response: person,
      },
    }
  );

  expect(state.id).toBe(person.id);
  expect(state.personFirstName).toBe(person.first_name);
  expect(state.personLastName).toBe(person.last_name);
  expect(state.contactAssignmentId).toBe(person.reverse_contact_assignments[0].id);
});

it('updates first name', () => {
  const firstName = 'test';
  const state = personProfile(
    {},
    {
      type: PERSON_FIRST_NAME_CHANGED,
      personFirstName: firstName,
    }
  );

  expect(state.personFirstName).toBe(firstName);
});

it('updates last name', () => {
  const lastName = 'test';
  const state = personProfile(
    {},
    {
      type: PERSON_LAST_NAME_CHANGED,
      personLastName: lastName,
    }
  );

  expect(state.personLastName).toBe(lastName);
});

it('resets state', () => {
  const state = personProfile(
    undefined,
    {
      type: RESET_ONBOARDING_PERSON,
    }
  );

  expect(state.personFirstName).toBe('');
  expect(state.personLastName).toBe('');
});
