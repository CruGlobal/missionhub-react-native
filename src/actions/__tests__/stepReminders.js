import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DAYS_OF_THE_WEEK } from '../../constants';
import callApi, { REQUESTS } from '../api';
import { createStepReminder } from '../stepReminders';

jest.mock('../api');

const mockStore = configureStore([thunk]);

const challenge_id = '442324';
const at = new Date();
const callApiResponse = { type: 'called api' };

let recurrence;
let store;

callApi.mockReturnValue(callApiResponse);

beforeEach(() => {
  jest.clearAllMocks();
  store = mockStore();
});

describe('createStepReminder', () => {
  beforeEach(() => {
    store.dispatch(createStepReminder(challenge_id, at, recurrence));
  });

  it('dispatches result to store', () => {
    expect(store.getActions()).toEqual([callApiResponse]);
  });

  describe('with null recurrence', () => {
    beforeAll(() => {
      recurrence = null;
    });

    it('calls api with correct payload', () => {
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id },
        {
          data: {
            attributes: {
              type: 'once',
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
      recurrence = 'daily';
    });

    it('calls api with correct payload', () => {
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id },
        {
          data: {
            attributes: {
              type: 'daily',
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
      recurrence = 'weekly';
    });

    it('calls api with correct payload', () => {
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id },
        {
          data: {
            attributes: {
              type: 'weekly',
              at: at.toLocaleTimeString(undefined, { hour12: false }),
              on: DAYS_OF_THE_WEEK[at.getDay()],
            },
          },
        },
      );
    });
  });

  describe('with monthly recurrence', () => {
    beforeAll(() => {
      recurrence = 'monthly';
    });

    it('calls api with correct payload', () => {
      expect(callApi).toHaveBeenCalledWith(
        REQUESTS.CREATE_CHALLENGE_REMINDER,
        { challenge_id },
        {
          data: {
            attributes: {
              type: 'monthly',
              at: at.toLocaleTimeString(undefined, { hour12: false }),
              on: at.getDate(),
            },
          },
        },
      );
    });
  });
});
