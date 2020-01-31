import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../../constants';
import { removeStepReminder, createStepReminder } from '../stepReminders';
import callApi from '../api';
import { REQUESTS } from '../../api/routes';

jest.mock('../api');

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

const mockStore = configureStore([thunk]);

const challenge_id = '442324';
const callApiResponse = { type: 'called api' };

// @ts-ignore
let reminder_at;
// @ts-ignore
let recurrence;
// @ts-ignore
let store;

// @ts-ignore
callApi.mockReturnValue(callApiResponse);

beforeEach(() => {
  store = mockStore();
});

describe('removeStepReminder', () => {
  beforeEach(() => {
    // @ts-ignore
    store.dispatch(removeStepReminder(challenge_id));
  });

  it('should remove reminder from step', () => {
    expect(callApi).toHaveBeenCalledWith(REQUESTS.DELETE_CHALLENGE_REMINDER, {
      challenge_id,
    });
  });
});

// @ts-ignore
const testApiCall = (reminder_type, reminder_at, reminder_on) =>
  expect(callApi).toHaveBeenCalledWith(
    REQUESTS.CREATE_CHALLENGE_REMINDER,
    { challenge_id },
    {
      data: {
        attributes: { reminder_type, reminder_at, reminder_on },
      },
    },
  );

describe('createStepReminder', () => {
  beforeAll(() => (reminder_at = new Date('2019-3-21 15:45:32')));

  beforeEach(() =>
    // @ts-ignore
    store.dispatch(createStepReminder(challenge_id, reminder_at, recurrence)),
  );

  it('dispatches result to store', () =>
    // @ts-ignore
    expect(store.getActions()).toEqual([callApiResponse]));

  describe('with undefined recurrence', () => {
    beforeAll(() => (recurrence = undefined));

    it('calls api with correct payload', () =>
      // @ts-ignore
      testApiCall(ONCE, reminder_at.toISOString(), null));
  });

  describe('with once recurrence', () => {
    beforeAll(() => (recurrence = ONCE));

    it('calls api with correct payload', () =>
      // @ts-ignore
      testApiCall(ONCE, reminder_at.toISOString(), null));
  });

  describe('with daily recurrence', () => {
    beforeAll(() => (recurrence = DAILY));

    it('calls api with correct payload', () =>
      testApiCall(
        DAILY,
        // @ts-ignore
        reminder_at.toLocaleTimeString(undefined, { hour12: false }),
        null,
      ));
  });

  describe('with weekly recurrence', () => {
    beforeAll(() => (recurrence = WEEKLY));

    it('calls api with correct payload', () =>
      testApiCall(
        WEEKLY,
        // @ts-ignore
        reminder_at.toLocaleTimeString(undefined, { hour12: false }),
        DAYS_OF_THE_WEEK[4],
      ));
  });

  describe('with monthly recurrence', () => {
    beforeAll(() => (recurrence = MONTHLY));

    describe('with day that occurs in every month', () => {
      it('calls api with correct payload', () =>
        testApiCall(
          MONTHLY,
          // @ts-ignore
          reminder_at.toLocaleTimeString(undefined, { hour12: false }),
          // @ts-ignore
          reminder_at.getDate(),
        ));
    });

    describe('with day that does not occur in every month', () => {
      beforeAll(() => (reminder_at = new Date('2019-3-30 15:45:32')));

      it('calls api with correct payload', () =>
        testApiCall(
          MONTHLY,
          // @ts-ignore
          reminder_at.toLocaleTimeString(undefined, { hour12: false }),
          // @ts-ignore
          reminder_at.getDate() - 32,
        ));
    });
  });
});