import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Alert } from 'react-native';
import i18n from 'i18next';

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
Alert.alert = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  store = mockStore();
});

//todo refactor
describe('with a date in the past', () => {
  it('handles error', async () => {
    expect.assertions(1);
    callApi.mockReturnValue(() =>
      Promise.reject({
        apiError: {
          errors: [
            {
              detail: {
                recurrence_rule: ["Value of 'at' is invalid, you dummy"],
              },
            },
          ],
        },
      }),
    );
    try {
      await store.dispatch(
        createStepReminder(challenge_id, new Date(), recurrence),
      );
    } catch (error) {
      expect(Alert.alert).toHaveBeenCalledWith(
        i18n.t('stepReminder:invalidReminderErrorHeader'),
        i18n.t('stepReminder:invalidReminderErrorBody'),
      );
    }

    callApi.mockReturnValue(callApiResponse);
  });
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
