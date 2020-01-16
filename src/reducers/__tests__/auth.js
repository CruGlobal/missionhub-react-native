import auth from '../auth';
import { REQUESTS } from '../../api/routes';
import {
  CLEAR_UPGRADE_TOKEN,
  LOGOUT,
  UPDATE_STAGES,
  UPDATE_TOKEN,
} from '../../constants';
import * as common from '../../utils/common';

const token = 'asdfasndfiosdc';
const personId = '123456';
const initialState = {
  person: {},
};

const callAuth = (type, results) => {
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

it('sets isJean after loading me', () => {
  const isJeanResponse = 'isJean';
  common.userIsJean = jest.fn().mockReturnValue(isJeanResponse);

  const organizational_permissions = [
    { id: 1, type: 'organizational_permission' },
  ];
  const response = {
    type: 'person',
    organizational_permissions,
    user: {
      groups_feature: true,
    },
  };

  const state = callAuth(REQUESTS.GET_ME.SUCCESS, { response });

  expect(state.isJean).toBe(isJeanResponse);
  expect(common.userIsJean).toHaveBeenCalledWith(organizational_permissions);
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
    {},
    {
      token,
      type: UPDATE_TOKEN,
    },
  );

  expect(state).toEqual({ token });
});

it("should clear the user's upgradeToken", () => {
  const state = auth(
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
      isJean: true,
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
    isJean: false,
    upgradeToken: null,
  });
});
