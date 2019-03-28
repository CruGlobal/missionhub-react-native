import { REQUESTS } from '../../actions/api';
import stepReminders from '../stepReminders';

const challenge_id = '10043234';
const reminder = 'some reminder';

describe('REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS', () => {
  it('adds response to state', () => {
    expect(
      stepReminders(undefined, {
        type: REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS,
        results: { response: reminder },
        query: { challenge_id },
      }),
    ).toEqual({ all: { [challenge_id]: reminder } });
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
