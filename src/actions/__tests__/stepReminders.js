import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../../constants';
import callApi, { REQUESTS } from '../api';
import { createStepReminder } from '../stepReminders';

jest.mock('../api');

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

const mockStore = configureStore([thunk]);

const challenge_id = '442324';
const at = new Date('2019-3-21 15:45:32');
const callApiResponse = { type: 'called api' };

let recurrence;
let store;

callApi.mockReturnValue(callApiResponse);

beforeEach(() => {
  jest.clearAllMocks();
  store = mockStore();
});
//todo fix
//describe('createStepReminder', () => {
beforeEach(() => {
  store.dispatch(createStepReminder(challenge_id, at, recurrence));
});

it('dispatches result to store', () => {
  expect(store.getActions()).toEqual([callApiResponse]);
});

describe('with once recurrence', () => {
  beforeAll(() => {
    recurrence = ONCE;
  });

  it('calls api with correct payload', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CHALLENGE_REMINDER,
      { challenge_id },
      {
        data: {
          attributes: {
            type: ONCE,
            at: at.toISOString(),
            on: undefined,
          },
        },
      },
    );
  });
});

describe('with daily recurrence', () => {
  beforeAll(() => {
    recurrence = DAILY;
  });

  it('calls api with correct payload', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CHALLENGE_REMINDER,
      { challenge_id },
      {
        data: {
          attributes: {
            type: DAILY,
            at: at.toLocaleTimeString(undefined, { hour12: false }),
            on: undefined,
          },
        },
      },
    );
  });
});

describe('with weekly recurrence', () => {
  beforeAll(() => {
    recurrence = WEEKLY;
  });

  it('calls api with correct payload', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CHALLENGE_REMINDER,
      { challenge_id },
      {
        data: {
          attributes: {
            type: WEEKLY,
            at: at.toLocaleTimeString(undefined, { hour12: false }),
            on: DAYS_OF_THE_WEEK[4],
          },
        },
      },
    );
  });
});

describe('with monthly recurrence', () => {
  beforeAll(() => {
    recurrence = MONTHLY;
  });

  it('calls api with correct payload', () => {
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CHALLENGE_REMINDER,
      { challenge_id },
      {
        data: {
          attributes: {
            type: MONTHLY,
            at: at.toLocaleTimeString(undefined, { hour12: false }),
            on: at.getDate(),
          },
        },
      },
    );
  });
});
//});
