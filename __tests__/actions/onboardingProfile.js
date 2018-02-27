import {
  firstNameChanged,
  lastNameChanged,
  createMyPerson,
  personFirstNameChanged,
  personLastNameChanged,
  createPerson, resetPerson,
} from '../../src/actions/onboardingProfile';
import {
  FIRST_NAME_CHANGED, LAST_NAME_CHANGED, PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED,
  RESET_ONBOARDING_PERSON,
} from '../../src/constants';
import callApi, { REQUESTS } from '../../src/actions/api';
jest.mock('../../src/actions/api');

const dispatch = jest.fn((response) => Promise.resolve(response));

beforeEach(() => {
  dispatch.mockClear();
  callApi.mockClear();
});

describe('firstNameChanged', () => {
  it('should return the correct action', () => {
    expect(firstNameChanged('test')).toEqual({
      type: FIRST_NAME_CHANGED,
      firstName: 'test',
    });
  });
});

describe('lastNameChanged', () => {
  it('should return the correct action', () => {
    expect(lastNameChanged('test')).toEqual({
      type: LAST_NAME_CHANGED,
      lastName: 'test',
    });
  });
});

describe('createMyPerson', () => {
  it('should send the correct API request', () => {
    createMyPerson('Roger', 'Goers')(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CREATE_MY_PERSON, {}, {
      code: expect.any(String),
      first_name: 'Roger',
      last_name: 'Goers',
    });
    expect(dispatch).toHaveBeenCalled();
  });
});

describe('createPerson', () => {
  it('should send the correct API request', () => {
    createPerson('Roger', 'Goers')(dispatch);
    expect(callApi).toHaveBeenCalledWith(REQUESTS.ADD_NEW_PERSON, {}, {
      data: {
        type: 'person',
        attributes: {
          first_name: 'Roger',
          last_name: 'Goers',
        },
      },
    });
    expect(dispatch).toHaveBeenCalled();
  });
});

describe('personFirstNameChanged', () => {
  it('should return the correct action', () => {
    expect(personFirstNameChanged('test')).toEqual({
      type: PERSON_FIRST_NAME_CHANGED,
      personFirstName: 'test',
    });
  });
});

describe('personLastNameChanged', () => {
  it('should return the correct action', () => {
    expect(personLastNameChanged('test')).toEqual({
      type: PERSON_LAST_NAME_CHANGED,
      personLastName: 'test',
    });
  });
});


describe('resetPerson', () => {
  it('should return the correct action', () => {
    expect(resetPerson()).toEqual({
      type: RESET_ONBOARDING_PERSON,
    });
  });
});
