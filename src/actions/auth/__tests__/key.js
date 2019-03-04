/* eslint max-lines: 0, max-lines-per-function: 0 */

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Linking } from 'react-native';
import Config from 'react-native-config';
import randomString from 'random-string';

import * as callApi from '../../api';
import { REQUESTS } from '../../api';
import * as constants from '../../../constants';
import {
  keyLogin,
  refreshAccessToken,
  openKeyURL,
  keyLoginWithAuthorizationCode,
} from '../key';
import { CLEAR_UPGRADE_TOKEN } from '../../../constants';
import { authSuccess } from '../userData';

Config.THE_KEY_URL = 'https://thekey.me/cas/';

jest.mock('random-string', () =>
  jest.fn().mockReturnValue('random-string-12345'),
);
jest.mock('../userData');
authSuccess.mockReturnValue({ type: 'authSuccess' });

const email = 'klas&jflk@lkjasdf.com';
const password = 'this&is=unsafe';
const mfaCode = '123456';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const refreshToken = 'khjdsfkksadjhsladjjldsvajdscandjehrwewrqr';
const upgradeToken = '2d2123bd-8142-42e7-98e4-81a0dd7a87a6';
const code = 'test-code';
const codeVerifier = 'cmFuZG9tLXN0cmluZy0xMjM0NQ';
const redirectUri = 'https://missionhub.com/auth';
const mockStore = configureStore([thunk]);

let store;

constants.THE_KEY_CLIENT_ID = mockClientId;

beforeEach(() => {
  store = mockStore({
    auth: {},
  });
});

describe('open key URL', () => {
  it('should open key URL', async () => {
    Linking.openURL = jest.fn();
    Linking.addEventListener = jest.fn((_, callback) => {
      callback({ url: `code=${code}` });
    });
    Linking.removeEventListener = jest.fn();

    await expect(
      store.dispatch(openKeyURL('login?action=signup')),
    ).resolves.toEqual({
      code,
      codeVerifier,
      redirectUri,
    });

    expect(randomString).toHaveBeenCalledWith({
      length: 50,
      numeric: true,
      letters: true,
      special: false,
    });

    expect(Linking.openURL).toHaveBeenCalledWith(
      'https://thekey.me/cas/login?action=signup&client_id=123456&response_type=code&redirect_uri=https://missionhub.com/auth&scope=fullticket%20extended&code_challenge_method=S256&code_challenge=g28fgSiaRCBxLJyvZg_JOu9aVvAk5o8uPdve2qTgJXc',
    );

    expect(Linking.addEventListener).toHaveBeenCalledWith(
      'url',
      expect.any(Function),
    );
    expect(Linking.removeEventListener).toHaveBeenCalledWith(
      'url',
      expect.any(Function),
    );
  });
});

describe('keyLogin', () => {
  it('without mfa or upgradeToken', async () => {
    callApi.default = jest
      .fn()
      .mockReturnValueOnce({ type: 'keyLogin' })
      .mockReturnValueOnce({ type: 'keyGetTicket', ticket })
      .mockReturnValueOnce({ type: 'keyTicketLogin' });

    await store.dispatch(keyLogin(email, password));

    expect(callApi.default).toHaveBeenNthCalledWith(
      1,
      REQUESTS.KEY_LOGIN,
      {},
      `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${encodeURIComponent(
        email,
      )}&password=${encodeURIComponent(password)}`,
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      2,
      REQUESTS.KEY_GET_TICKET,
      {},
      {},
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      3,
      REQUESTS.TICKET_LOGIN,
      {},
      {
        code: ticket,
      },
    );

    expect(store.getActions()).toEqual([
      { type: 'keyLogin' },
      { type: 'keyGetTicket', ticket },
      { type: 'keyTicketLogin' },
      { type: CLEAR_UPGRADE_TOKEN },
      { type: 'authSuccess' },
    ]);
  });
  it('with mfa', async () => {
    callApi.default = jest
      .fn()
      .mockReturnValueOnce({ type: 'keyLogin' })
      .mockReturnValueOnce({ type: 'keyGetTicket', ticket })
      .mockReturnValueOnce({ type: 'keyTicketLogin' });

    await store.dispatch(keyLogin(email, password, mfaCode));

    expect(callApi.default).toHaveBeenNthCalledWith(
      1,
      REQUESTS.KEY_LOGIN,
      {},
      `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${encodeURIComponent(
        email,
      )}&password=${encodeURIComponent(password)}&thekey_mfa_token=${mfaCode}`,
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      2,
      REQUESTS.KEY_GET_TICKET,
      {},
      {},
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      3,
      REQUESTS.TICKET_LOGIN,
      {},
      {
        code: ticket,
      },
    );

    expect(store.getActions()).toEqual([
      { type: 'keyLogin' },
      { type: 'keyGetTicket', ticket },
      { type: 'keyTicketLogin' },
      { type: CLEAR_UPGRADE_TOKEN },
      { type: 'authSuccess' },
    ]);
  });
  it('with upgradeToken', async () => {
    store = mockStore({
      auth: { upgradeToken },
    });

    callApi.default = jest
      .fn()
      .mockReturnValueOnce({ type: 'keyLogin' })
      .mockReturnValueOnce({ type: 'keyGetTicket', ticket })
      .mockReturnValueOnce({ type: 'keyTicketLogin' });

    await store.dispatch(keyLogin(email, password));

    expect(callApi.default).toHaveBeenNthCalledWith(
      1,
      REQUESTS.KEY_LOGIN,
      {},
      `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${encodeURIComponent(
        email,
      )}&password=${encodeURIComponent(password)}`,
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      2,
      REQUESTS.KEY_GET_TICKET,
      {},
      {},
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      3,
      REQUESTS.TICKET_LOGIN,
      {},
      {
        code: ticket,
        client_token: upgradeToken,
      },
    );

    expect(store.getActions()).toEqual([
      { type: 'keyLogin' },
      { type: 'keyGetTicket', ticket },
      { type: 'keyTicketLogin' },
      { type: CLEAR_UPGRADE_TOKEN },
      { type: 'authSuccess' },
    ]);
  });
  it('with invalidated upgradeToken', async () => {
    store = mockStore({
      auth: { upgradeToken },
    });

    callApi.default = jest
      .fn()
      .mockReturnValueOnce({ type: 'keyLogin' })
      .mockReturnValueOnce({ type: 'keyGetTicket', ticket })
      .mockReturnValueOnce(() => {
        throw {
          apiError: {
            errors: [
              { status: '422', detail: 'client_token already invalidated' },
            ],
          },
        };
      })
      .mockReturnValueOnce({ type: 'keyTicketLogin' });

    await store.dispatch(keyLogin(email, password));

    expect(callApi.default).toHaveBeenNthCalledWith(
      1,
      REQUESTS.KEY_LOGIN,
      {},
      `grant_type=password&client_id=${mockClientId}&scope=fullticket%20extended&username=${encodeURIComponent(
        email,
      )}&password=${encodeURIComponent(password)}`,
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      2,
      REQUESTS.KEY_GET_TICKET,
      {},
      {},
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      3,
      REQUESTS.TICKET_LOGIN,
      {},
      {
        code: ticket,
        client_token: upgradeToken,
      },
    );
    expect(callApi.default).toHaveBeenNthCalledWith(
      4,
      REQUESTS.TICKET_LOGIN,
      {},
      {
        code: ticket,
      },
    );

    expect(store.getActions()).toEqual([
      { type: 'keyLogin' },
      { type: 'keyGetTicket', ticket },
      { type: 'keyTicketLogin' },
      { type: CLEAR_UPGRADE_TOKEN },
      { type: 'authSuccess' },
    ]);
  });

  describe('keyLoginWithAuthorizationCode', () => {
    it('should use code to login', async () => {
      callApi.default = jest
        .fn()
        .mockReturnValueOnce({ type: 'keyLogin' })
        .mockReturnValueOnce({ type: 'keyGetTicket', ticket })
        .mockReturnValueOnce({ type: 'keyTicketLogin' });

      await store.dispatch(
        keyLoginWithAuthorizationCode(code, codeVerifier, redirectUri),
      );

      expect(callApi.default).toHaveBeenNthCalledWith(
        1,
        REQUESTS.KEY_LOGIN,
        {},
        `grant_type=authorization_code&client_id=${mockClientId}&code=${code}&code_verifier=${codeVerifier}&redirect_uri=${redirectUri}`,
      );
      expect(callApi.default).toHaveBeenNthCalledWith(
        2,
        REQUESTS.KEY_GET_TICKET,
        {},
        {},
      );
      expect(callApi.default).toHaveBeenNthCalledWith(
        3,
        REQUESTS.TICKET_LOGIN,
        {},
        {
          code: ticket,
        },
      );

      expect(store.getActions()).toEqual([
        { type: 'keyLogin' },
        { type: 'keyGetTicket', ticket },
        { type: 'keyTicketLogin' },
        { type: CLEAR_UPGRADE_TOKEN },
        { type: 'authSuccess' },
      ]);
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token', async () => {
      store = mockStore({
        auth: { refreshToken },
      });
      callApi.default = jest
        .fn()
        .mockReturnValueOnce({ type: 'keyLogin' })
        .mockReturnValueOnce({ type: 'keyGetTicket', ticket })
        .mockReturnValueOnce({ type: 'keyTicketLogin' });

      await store.dispatch(refreshAccessToken());

      expect(callApi.default).toHaveBeenNthCalledWith(
        1,
        REQUESTS.KEY_REFRESH_TOKEN,
        {},
        `grant_type=refresh_token&refresh_token=${refreshToken}`,
      );
      expect(callApi.default).toHaveBeenNthCalledWith(
        2,
        REQUESTS.KEY_GET_TICKET,
        {},
        {},
      );
      expect(callApi.default).toHaveBeenNthCalledWith(
        3,
        REQUESTS.TICKET_LOGIN,
        {},
        {
          code: ticket,
        },
      );

      expect(store.getActions()).toEqual([
        { type: 'keyLogin' },
        { type: 'keyGetTicket', ticket },
        { type: 'keyTicketLogin' },
        { type: CLEAR_UPGRADE_TOKEN },
      ]);
    });
  });
});
