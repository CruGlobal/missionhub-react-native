import auth from '../../src/reducers/auth';
import { REQUESTS } from '../../src/actions/api';
import { JsonApiDataStore } from 'jsonapi-datastore';
import { UPDATE_STAGES } from '../../src/constants';

const token = 'asdfasndfiosdc';
const personId = 123456;

const callAuth = (type, results) => {
  return auth(
    { user: {} },
    {
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
  expect(state.personId).toBe(`${personId}`);
});

it('returns token, person id, and logged in status after creating person', () => {
  global.LOG = jest.fn();

  const state = callAuth(REQUESTS.CREATE_MY_PERSON.SUCCESS, {
    token: token,
    person_id: personId,
  });

  expect(state.isLoggedIn).toBe(true);
  expect(state.token).toBe(token);
  expect(state.personId).toBe(`${personId}`);
});

it('sets isJean after loading me', () => {
  const jsonApiStore = new JsonApiDataStore();
  jsonApiStore.sync({
    data: {
      type: 'person',
      relationships: {
        organizational_permissions: {
          data: [
            { id: 1, type: 'organizational_permission' },
          ],
        },
      },
    },
  });

  const state = callAuth(REQUESTS.GET_ME.SUCCESS, jsonApiStore);

  expect(state.isJean).toBe(true);
});

it('sets user time zone', () => {
  const jsonApiStore = new JsonApiDataStore();
  jsonApiStore.sync({
    data: {
      type: 'user',
      attributes: {
        timezone: '-5',
      },
    },
  });

  const state = callAuth(REQUESTS.UPDATE_TIMEZONE.SUCCESS, jsonApiStore);

  expect(state.timezone).toBe('-5');
});

it('updates a users stage', () => {
  const state = auth(
    { user: { user: { pathway_stage_id: 2 } } },
    {
      type: UPDATE_STAGES,
      stages: [
        { id: 2 },
      ],
    });

  console.log('state', state);

  expect(state.user.stage.id).toBe(2);
});
