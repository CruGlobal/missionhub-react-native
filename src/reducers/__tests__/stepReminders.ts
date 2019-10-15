import { REQUESTS } from '../../api/routes';
import stepReminders from '../stepReminders';
import { LOGOUT } from '../../constants';

const challenge_id = '10043234';
const remindersArray = [{ id: '11' }, { id: '22' }, { id: '33' }];
const stepsWithReminders = [
  { id: '1', reminder: remindersArray[0] },
  { id: '2', reminder: remindersArray[1] },
  { id: '3', reminder: remindersArray[2] },
];
const remindersObject = {
  [stepsWithReminders[0].id]: remindersArray[0],
  [stepsWithReminders[1].id]: remindersArray[1],
  [stepsWithReminders[2].id]: remindersArray[2],
};

const reminder = 'some reminder';

describe('REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS', () => {
  it('adds response to state', () => {
    const response = reminder;

    expect(
      stepReminders(undefined, {
        type: REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS,
        results: { response },
        query: { challenge_id },
      }),
    ).toEqual({ allByStep: { [challenge_id]: reminder } });
  });
});

describe('REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS', () => {
  it('adds reminders from steps to state', () => {
    const response = stepsWithReminders;

    expect(
      stepReminders(undefined, {
        type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
        results: { response },
      }),
    ).toEqual({ allByStep: remindersObject });
  });

  it('replaces existing reminder instance with updated one', () => {
    const reminderId = '1231234';
    const oldReminder = { id: reminderId, text: 'old data' };
    const newReminder = { id: reminderId, text: 'new data' };
    const response = [
      ...stepsWithReminders,
      { id: challenge_id, reminder: newReminder },
    ];

    expect(
      stepReminders(
        { allByStep: { [challenge_id]: oldReminder } },
        {
          type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
          results: { response },
        },
      ),
    ).toEqual({
      allByStep: { ...remindersObject, [challenge_id]: newReminder },
    });
  });

  it('does not store reminder for step if reminder is null', () => {
    const response = [
      ...stepsWithReminders,
      { id: challenge_id, reminder: null },
    ];

    expect(
      stepReminders(undefined, {
        type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
        results: { response },
      }),
    ).toEqual({ allByStep: remindersObject });
  });

  it('removes reminder for step if updated reminder is null', () => {
    const response = [
      ...stepsWithReminders,
      { id: challenge_id, reminder: null },
    ];

    expect(
      stepReminders(
        { allByStep: { ...remindersObject, [challenge_id]: { id: '1111' } } },
        {
          type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
          results: { response },
        },
      ),
    ).toEqual({ allByStep: remindersObject });
  });
});

describe('REQUESTS.GET_MY_CHALLENGES.SUCCESS', () => {
  it('adds reminders from steps to state', () => {
    const response = stepsWithReminders;

    expect(
      stepReminders(undefined, {
        type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
        results: { response },
      }),
    ).toEqual({ allByStep: remindersObject });
  });

  it('replaces existing reminder instance with updated one', () => {
    const reminderId = '1231234';
    const oldReminder = { id: reminderId, text: 'old data' };
    const newReminder = { id: reminderId, text: 'new data' };
    const response = [
      ...stepsWithReminders,
      { id: challenge_id, reminder: newReminder },
    ];

    expect(
      stepReminders(
        { allByStep: { [challenge_id]: oldReminder } },
        {
          type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
          results: { response },
        },
      ),
    ).toEqual({
      allByStep: { ...remindersObject, [challenge_id]: newReminder },
    });
  });

  it('does not store reminder for step if reminder is null', () => {
    const response = [
      ...stepsWithReminders,
      { id: challenge_id, reminder: null },
    ];

    expect(
      stepReminders(undefined, {
        type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
        results: { response },
      }),
    ).toEqual({ allByStep: remindersObject });
  });

  it('removes reminder for step if updated reminder is null', () => {
    const response = [
      ...stepsWithReminders,
      { id: challenge_id, reminder: null },
    ];

    expect(
      stepReminders(
        { allByStep: { ...remindersObject, [challenge_id]: { id: '1111' } } },
        {
          type: REQUESTS.GET_MY_CHALLENGES.SUCCESS,
          results: { response },
        },
      ),
    ).toEqual({ allByStep: remindersObject });
  });
});

describe('REQUESTS.DELETE_CHALLENGE_REMINDER.SUCCESS', () => {
  it('removes reminder from state', () => {
    expect(
      stepReminders(
        { allByStep: { [challenge_id]: reminder } },
        {
          type: REQUESTS.DELETE_CHALLENGE_REMINDER.SUCCESS,
          query: { challenge_id },
        },
      ),
    ).toEqual({ allByStep: {} });
  });
});

describe('LOGOUT', () => {
  it('resets to initial state', () => {
    expect(
      stepReminders(
        { allByStep: { [challenge_id]: reminder } },
        { type: LOGOUT },
      ),
    ).toEqual({ allByStep: {} });
  });
});

describe('NOT FOUND', () => {
  it('type is not found', () => {
    const testState = { allByStep: { [challenge_id]: reminder } };
    expect(stepReminders(testState, { type: 'NOT FOUND TYPE' })).toEqual(
      testState,
    );
  });
});
