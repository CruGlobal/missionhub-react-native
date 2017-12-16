import {keyLogin} from '../../src/actions/auth';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as callApi from '../../src/actions/api';

callApi.default = jest.fn().mockImplementation(
  function() {
    return dispatch => {
      return dispatch(() => Promise.resolve({ type: 'success' }));
    };
  }
);

const username = 'Roger';
const password = 'secret';
const mockStore = configureStore([thunk]);

it('should send request for key ticket', () => {
  const store = mockStore({});

  return store.dispatch(keyLogin(username, password))
    .then(() => {
      expect(callApi.default).toHaveBeenCalledTimes(3);
    });
});