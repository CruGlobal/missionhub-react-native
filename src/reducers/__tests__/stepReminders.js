import { REQUESTS } from '../../actions/api';
import stepReminders from '../stepReminders';

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
    const response = 'some reminder';

    expect(
      stepReminders(undefined, {
        type: REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS,
        results: { response: reminder },
        query: { challenge_id },
      }),
    ).toEqual({ all: { [challenge_id]: reminder } });
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
});
    

describe('REQUESTS.DELETE_CHALLENGE_REMINDER.SUCCESS', () => {
  it('removes reminder from state', () => {
    expect(
      stepReminders(
        {
          all: {
            [challenge_id]: reminder,
          },
        },
        {
          type: REQUESTS.DELETE_CHALLENGE_REMINDER.SUCCESS,
          query: { challenge_id },
        },
      ),
    ).toEqual({ all: {} });
  });
});
