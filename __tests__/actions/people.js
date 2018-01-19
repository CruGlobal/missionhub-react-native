import { getMe } from '../../src/actions/people';
import * as api from '../../src/actions/api';
import { REQUESTS } from '../../src/actions/api';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const store = mockStore();

describe('get me', () => {
  const action = { type: 'got me' };

  api.default = jest.fn().mockImplementation(
    (requestObj) => requestObj === REQUESTS.GET_ME ? action : null
  );

  it('should get me', () => {
    store.dispatch(getMe());

    expect(store.getActions()[0]).toBe(action);
  });
});