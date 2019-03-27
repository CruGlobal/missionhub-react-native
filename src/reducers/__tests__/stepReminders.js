import { REQUESTS } from '../../actions/api';
import stepReminders from '../stepReminders';

describe('REQUESTS.CREATE_CHALLENGE_REMINDER.SUCCESS', () => {
  it('adds response to state', () => {
    const challenge_id = '10043234';
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
