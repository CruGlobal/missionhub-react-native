import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { DAYS_OF_THE_WEEK, REMINDER_RECURRENCES } from '../../constants';
import callApi, { REQUESTS } from '../api';
import { createStepReminder } from '../stepReminders';

jest.mock('../api');

const { ONCE, DAILY, WEEKLY, MONTHLY } = REMINDER_RECURRENCES;

const mockStore = configureStore([thunk]);

const challenge_id = '442324';
const callApiResponse = { type: 'called api' };

let at;
let recurrence;
let store;

callApi.mockReturnValue(callApiResponse);

beforeEach(() => {
  store = mockStore();
});

describe('createStepReminder', () => {
  beforeAll(() => (at = new Date('2019-3-21 15:45:32')));

  beforeEach(() =>
    store.dispatch(createStepReminder(challenge_id, at, recurrence)));

  const testApiCall = (type, at, on) =>
    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_CHALLENGE_REMINDER,
      { challenge_id },
      {
        data: {
          attributes: { type, at, on },
        },
      },
    );

  it('dispatches result to store', () =>
    expect(store.getActions()).toEqual([callApiResponse]));

  describe('with once recurrence', () => {
    beforeAll(() => (recurrence = ONCE));

    it('calls api with correct payload', () =>
      testApiCall(ONCE, at.toISOString(), undefined));
  });

  describe('with daily recurrence', () => {
    beforeAll(() => (recurrence = DAILY));

    it('calls api with correct payload', () =>
      testApiCall(
        DAILY,
        at.toLocaleTimeString(undefined, { hour12: false }),
        undefined,
      ));
  });

  describe('with weekly recurrence', () => {
    beforeAll(() => (recurrence = WEEKLY));

    it('calls api with correct payload', () =>
      testApiCall(
        WEEKLY,
        at.toLocaleTimeString(undefined, { hour12: false }),
        DAYS_OF_THE_WEEK[4],
      ));
  });

  describe('with monthly recurrence', () => {
    beforeAll(() => (recurrence = MONTHLY));

    describe('with day that occurs in every month', () => {
      it('calls api with correct payload', () =>
        testApiCall(
          MONTHLY,
          at.toLocaleTimeString(undefined, { hour12: false }),
          at.getDate(),
        ));
    });

    describe('with day that does not occur in every month', () => {
      beforeAll(() => (at = new Date('2019-3-30 15:45:32')));

      it('calls api with correct payload', () =>
        testApiCall(
          MONTHLY,
          at.toLocaleTimeString(undefined, { hour12: false }),
          at.getDate() - 32,
        ));
    });
  });
});
