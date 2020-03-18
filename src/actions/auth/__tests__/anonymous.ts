import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi from '../../api';
import { REQUESTS } from '../../../api/routes';
import { authSuccess } from '../userData';
import { codeLogin, refreshAnonymousLogin } from '../anonymous';

jest.mock('../../api');
jest.mock('../userData');

const upgradeToken = '2d2123bd-8142-42e7-98e4-81a0dd7a87a6';
const mockStore = configureStore([thunk]);

// @ts-ignore
let store;

beforeEach(() => {
  // @ts-ignore
  authSuccess.mockReturnValue({ type: 'test' });
  store = mockStore({
    auth: {
      upgradeToken,
    },
  });
});

describe('codeLogin', () => {
  it('should login with code, and track person', async () => {
    // @ts-ignore
    callApi.mockReturnValue({ type: 'test' });

    // @ts-ignore
    await store.dispatch(codeLogin('123'));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      { code: '123' },
    );
    expect(authSuccess).toHaveBeenCalledTimes(1);
  });

  it('should not track person on error', async () => {
    // @ts-ignore
    callApi.mockReturnValue(() => {
      throw 'some error';
    });

    // @ts-ignore
    await expect(store.dispatch(codeLogin('123'))).rejects.toEqual(
      'some error',
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      { code: '123' },
    );
    expect(authSuccess).not.toHaveBeenCalled();
  });
});

describe('refreshAnonymousLogin', () => {
  const apiResult = { type: 'refreshed anonymous token' };

  it('should send the code', async () => {
    // @ts-ignore
    callApi.mockReturnValue(dispatch => dispatch(apiResult));

    // @ts-ignore
    await store.dispatch(refreshAnonymousLogin());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.REFRESH_ANONYMOUS_LOGIN,
      {},
      { code: upgradeToken },
    );
    // @ts-ignore
    expect(store.getActions()).toEqual([apiResult]);
  });
});
