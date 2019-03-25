import { REQUESTS } from '../../actions/api';
import stepReminders from '../stepReminders';

const challenge_id = '10043234';
const remindersArray = [{ id: '11' }, { id: '22' }, { id: '33' }];
const remindersObject = {
  [remindersArray[0].id]: remindersArray[0],
  [remindersArray[1].id]: remindersArray[1],
  [remindersArray[2].id]: remindersArray[2],
};
const stepsWithReminders = [
  { id: '1', reminder: remindersArray[0] },
  { id: '2', reminder: remindersArray[1] },
  { id: '3', reminder: remindersArray[2] },
];

describe('REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS', () => {
  it('adds response to state', () => {
    const response = 'some reminder';

    expect(
      stepReminders(undefined, {
        type: REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS,
        results: { response },
        query: { challenge_id },
      }),
    ).toEqual({ all: { [challenge_id]: response } });
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
    ).toEqual({ all: remindersObject });
  });

  it('replaces existing reminder instance with updated one', () => {
    const oldReminder = { id: challenge_id, text: 'old data' };
    const newReminder = { id: challenge_id, text: 'new data' };
    const response = [
      ...stepsWithReminders,
      { id: '112312354', reminder: newReminder },
    ];

    expect(
      stepReminders(
        { all: { [challenge_id]: oldReminder } },
        {
          type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
          results: { response },
        },
      ),
    ).toEqual({ all: { ...remindersObject, [challenge_id]: newReminder } });
  });

  it('does not store reminder for step if reminder is null', () => {
    const response = [
      ...stepsWithReminders,
      { id: '112312354', reminder: null },
    ];

    expect(
      stepReminders(undefined, {
        type: REQUESTS.GET_CHALLENGES_BY_FILTER.SUCCESS,
        results: { response },
      }),
    ).toEqual({ all: remindersObject });
  });
});
