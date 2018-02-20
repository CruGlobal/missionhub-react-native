import personProfile from '../../src/reducers/personProfile';
import { REQUESTS } from '../../src/actions/api';
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, UPDATE_ONBOARDING_PERSON, RESET_ONBOARDING_PERSON } from '../../src/constants';

it('updates from API call', () => {
  const firstName = 'test';
  const lastName = 'test last';
  const id = 1;
  const state = personProfile(
    {},
    {
      type: REQUESTS.ADD_NEW_PERSON.SUCCESS,
      results: {
        findAll: () => [
          {
            id,
            first_name: firstName,
            last_name: lastName,
          },
        ],
      },
    }
  );

  expect(state.personFirstName).toBe(firstName);
  expect(state.personLastName).toBe(lastName);
  expect(state.id).toBe(id);
});

it('updates from update API call', () => {
  const firstName = 'test';
  const lastName = 'test last';
  const id = 1;
  const state = personProfile(
    {},
    {
      type: UPDATE_ONBOARDING_PERSON,
      results: {
        findAll: () => [
          {
            id,
            first_name: firstName,
            last_name: lastName,
          },
        ],
      },
    }
  );

  expect(state.personFirstName).toBe(firstName);
  expect(state.personLastName).toBe(lastName);
  expect(state.id).toBe(id);
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
