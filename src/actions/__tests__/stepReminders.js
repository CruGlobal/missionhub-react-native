import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { removeStepReminder } from '../stepReminders';
import callApi, { REQUESTS } from '../api';

jest.mock('../api');

const stepId = '1';
const apiResult = { type: 'call API' };
let store;

beforeEach(() => {
  callApi.mockReturnValue(apiResult);
  store = configureStore([thunk])();
});

describe('removeStepReminder', () => {
  beforeEach(() => {
    store.dispatch(removeStepReminder(stepId));
  });

  it('should remove reminder from step', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.CHALLENGE_REMINDER_DELETE, {
      challenge_id: stepId,
    });
  });
});
