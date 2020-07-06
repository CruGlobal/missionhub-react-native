import auth, { AuthState } from '../auth';
import { REQUESTS } from '../../api/routes';
import {
  CLEAR_UPGRADE_TOKEN,
  LOGOUT,
  UPDATE_STAGES,
  UPDATE_TOKEN,
} from '../../constants';

const token = 'asdfasndfiosdc';
const personId = '123456';
const initialState: Partial<AuthState> = {
  person: {},
};

// @ts-ignore
const callAuth = (type, results) => {
  // @ts-ignore
  return auth(initialState, {
    type: type,
    results: results,
  });
};

it('returns access token and refresh token after successful key login', () => {
  const refreshToken = 'jninjjkmjkmklklmkljh';

  const state = callAuth(REQUESTS.KEY_LOGIN.SUCCESS, {
    access_token: token,
    refresh_token: refreshToken,
  });

  expect(state.token).toBe(token);
  expect(state.refreshToken).toBe(refreshToken);
});

it('returns new access token after using refresh token', () => {
  const newAccessToken = 'asdsdfncncoppoop';

  const state = callAuth(REQUESTS.KEY_REFRESH_TOKEN.SUCCESS, {
    access_token: newAccessToken,
  });

  expect(state.token).toBe(newAccessToken);
});

it('returns token and person id after logging in with ticket', () => {
  const state = callAuth(REQUESTS.TICKET_LOGIN.SUCCESS, {
    token: token,
    person_id: personId,
  });

  expect(state.token).toBe(token);
  expect(state.person.id).toBe(`${personId}`);
});

it('returns token, person id, and logged in status after creating person', () => {
  // @ts-ignore
  global.LOG = jest.fn();

  const state = callAuth(REQUESTS.CREATE_MY_PERSON.SUCCESS, {
    token: token,
    person_id: personId,
  });

  expect(state.token).toBe(token);
  expect(state.person.id).toBe(`${personId}`);
});

it('sets new token after refreshing anonymous login', () => {
  const state = callAuth(REQUESTS.REFRESH_ANONYMOUS_LOGIN.SUCCESS, {
    token: token,
  });

  expect(state).toEqual({ ...initialState, token });
});

it('does not set new token after refreshing anonymous login if user is logged out', () => {
  const state = auth(
    // @ts-ignore
    { ...initialState, token: '' },
    { type: REQUESTS.REFRESH_ANONYMOUS_LOGIN.SUCCESS, results: { token } },
  );

  expect(state).toEqual({ ...initialState, token: '' });
});

it('sets unread_comments_count', () => {
  const newCommentsCount = 5;
  const response = { unread_comments_count: newCommentsCount };

  const state = callAuth(REQUESTS.GET_UNREAD_COMMENTS_NOTIFICATION.SUCCESS, {
    response,
  });

  expect(state.person.unread_comments_count).toEqual(newCommentsCount);
});

it('sets user time zone', () => {
  const action = {
    response: {
      timezone: '-10',
      language: 'en-US',
    },
  };

  const state = callAuth(REQUESTS.UPDATE_ME_USER.SUCCESS, action);

  expect(state.person.user.timezone).toEqual(action.response.timezone);
  expect(state.person.user.language).toEqual(action.response.language);
});

it('logs in with facebook', () => {
  const result = {
    token,
    person: {
      id: '123',
    },
  };

  const state = callAuth(REQUESTS.FACEBOOK_LOGIN.SUCCESS, result);

  expect(state.token).toBe(token);
});

it('updates a users stage', () => {
  const state = auth(
    // @ts-ignore
    {
      person: {
        user: {
          pathway_stage_id: '2',
        },
      },
    },
    {
      type: UPDATE_STAGES,
      stages: [{ id: '2' }],
    },
  );

  expect(state.person.stage.id).toBe('2');
});

it('updates a user token', () => {
  const state = auth(
    // @ts-ignore
    {},
    {
      token,
      type: UPDATE_TOKEN,
    },
  );

  expect(state).toEqual({ token });
});

it('does not update a user token if the user has already logged out', () => {
  const state = auth(
    // @ts-ignore
    { token: '' },
    {
      token,
      type: UPDATE_TOKEN,
    },
  );

  expect(state).toEqual({ token: '' });
});

it("should clear the user's upgradeToken", () => {
  const state = auth(
    // @ts-ignore
    { upgradeToken: 'something' },
    {
      type: CLEAR_UPGRADE_TOKEN,
    },
  );

  expect(state).toEqual({ upgradeToken: null });
});

it('should reset state on logout', () => {
  const state = auth(
    {
      token: 'some token',
      refreshToken: 'some refresh token',
      person: { user: { id: '1' } },
      upgradeToken: 'some upgrade token',
    },
    {
      type: LOGOUT,
    },
  );

  expect(state).toEqual({
    token: undefined,
    refreshToken: '',
    person: { user: {} },
    upgradeToken: null,
  });
});
