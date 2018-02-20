
import { PERSON_FIRST_NAME_CHANGED, PERSON_LAST_NAME_CHANGED, SAVE_NOTES, RESET_ONBOARDING_PERSON } from '../../src/constants';
import { personFirstNameChanged, personLastNameChanged, saveNotes, resetPerson } from '../../src/actions/person';


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
    expect(saveNotes(1, 'test')).toEqual({
      type: SAVE_NOTES,
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
