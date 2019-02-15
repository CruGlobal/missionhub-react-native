import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import callApi, { REQUESTS } from '../../api';
import { firstTime, authSuccessTrackPerson } from '../userData';
import { codeLogin, refreshAnonymousLogin } from '../anonymous';

jest.mock('../../api');
jest.mock('../userData');

const upgradeToken = '2d2123bd-8142-42e7-98e4-81a0dd7a87a6';
const mockStore = configureStore([thunk]);

let store;

beforeEach(() => {
  firstTime.mockReturnValue({ type: 'test' });
  authSuccessTrackPerson.mockReturnValue({ type: 'test' });
  store = mockStore({
    auth: {
      upgradeToken,
    },
  });
});

describe('codeLogin', () => {
  it('should login with code, set first time, and track person', async () => {
    callApi.mockReturnValue({ type: 'test' });

    await store.dispatch(codeLogin('123'));

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      { code: '123' },
    );
    expect(firstTime).toHaveBeenCalledTimes(1);
    expect(authSuccessTrackPerson).toHaveBeenCalledTimes(1);
  });

  it('should not set first time or track person on error', async () => {
    callApi.mockReturnValue(() => {
      throw 'some error';
    });

    await expect(store.dispatch(codeLogin('123'))).rejects.toEqual(
      'some error',
    );

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.CREATE_MY_PERSON,
      {},
      { code: '123' },
    );
    expect(firstTime).not.toHaveBeenCalled();
    expect(authSuccessTrackPerson).not.toHaveBeenCalled();
  });
});

describe('refreshAnonymousLogin', () => {
  const apiResult = { type: 'refreshed anonymous token' };

  it('should send the code', async () => {
    callApi.mockReturnValue(dispatch => dispatch(apiResult));

    await store.dispatch(refreshAnonymousLogin());

    expect(callApi).toHaveBeenCalledWith(
      REQUESTS.REFRESH_ANONYMOUS_LOGIN,
      {},
      { code: upgradeToken },
    );
    expect(store.getActions()).toEqual([apiResult]);
  });
});
