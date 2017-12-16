import {keyLogin} from '../../src/actions/auth';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as callApi from '../../src/actions/api';
import * as constants from '../../src/constants';
import {REQUESTS} from '../../src/actions/api';

const username = 'Roger';
const password = 'secret';
const mockClientId = 123456;
const ticket = 'nfnvjvkfkfj886';
const data = 'grant_type=password&client_id=' + mockClientId + '&scope=fullticket%20extended&username=' + username + '&password=' + password;
const mockStore = configureStore([thunk]);

constants.THE_KEY_CLIENT_ID = mockClientId;

callApi.default = jest.fn().mockImplementation(
  function(type) {
    return dispatch => {
      return dispatch(() => {
        if (type === REQUESTS.KEY_GET_TICKET) {
          return Promise.resolve({ ticket: ticket });
        } else {
          return Promise.resolve({});
        }
      });
    };
  }
);

it('should send request for key ticket', () => {
  const store = mockStore({});

  return store.dispatch(keyLogin(username, password))
    .then(() => {
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_LOGIN, {}, data);
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.KEY_GET_TICKET, {}, {});
      expect(callApi.default).toHaveBeenCalledWith(REQUESTS.TICKET_LOGIN, {}, { code: ticket });
    });
});