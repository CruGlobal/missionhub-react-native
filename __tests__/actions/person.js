
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, RESET_ONBOARDING_PERSON } from '../../src/constants';
import { REQUESTS } from '../../src/actions/api';
import { personFirstNameChanged, personLastNameChanged, savePersonNotes, resetPerson } from '../../src/actions/person';


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

describe('saveNotes', () => {
  it('should return the correct action', () => {
    expect(savePersonNotes(1, 'test')).toEqual({
      type: REQUESTS.ADD_PERSON_NOTES,
      personId: 1,
      notes: 'test',
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
