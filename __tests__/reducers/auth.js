import auth from '../../src/reducers/auth';
import { REQUESTS } from '../../src/actions/api';

const token = 'asdfasndfiosdc';
const personId = 123456;

const callAuth = (type, results) => {
  return auth(
    {},
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

it('returns token and person id after logging in with ticket', () => {
  const state = callAuth(REQUESTS.TICKET_LOGIN.SUCCESS, {
    token: token,
    person_id: personId,
  });

  expect(state.token).toBe(token);
  expect(state.personId).toBe(personId);
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