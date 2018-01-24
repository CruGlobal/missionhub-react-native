import API_CALLS, {
  baseErrorMessage, invalidCredentialsMessage, unexpectedErrorMessage,
  verifyEmailMessage,
} from '../src/api';
import * as utils from '../src/api/utils';
import { REQUESTS } from '../src/actions/api';
import ReactNative from 'react-native';

let serverResponse = {};

beforeEach(() => {
  global.APILOG = jest.fn();
  global.LOG = jest.fn();

  utils.default = () => Promise.reject(serverResponse);
  expect.assertions(1);
});

const callMethod = (mockResponse, callback) => {
  serverResponse = mockResponse;

  return API_CALLS[REQUESTS.GET_ME.name]({}, {}).catch(callback);
};

//warning: a silent failure can occur in the described class and the result of the test is a timeout
describe('call api', () => {
  it('should return email/password message when TheKey returns invalid request', () => {
    return callMethod({ ['error']: 'invalid_request' }, (error) => {
      expect(error).toEqual({ user_error: invalidCredentialsMessage });
    });
  });

  it('should return email/password message when TheKey returns invalid credentials', () => {
    return callMethod({ ['thekey_authn_error']: 'invalid_credentials' }, (error) => {
      expect(error).toEqual({ user_error: invalidCredentialsMessage });
    });
  });

  it('should return email/password message when TheKey returns invalid credentials', () => {
    return callMethod({ ['thekey_authn_error']: 'email_unverified' }, (error) => {
      expect(error).toEqual({ user_error: verifyEmailMessage });
    });
  });

  describe('other error messages', () => {
    beforeEach(() => ReactNative.Alert.alert = jest.fn());

    it('should return server response', () => {
      return callMethod({ error: 'test' }, (error) => {
        expect(error).toEqual(serverResponse);
      });
    });

    it('should show generic error message if request does not have it', () => {
      return callMethod({ error: 'test' }, () => {
        expect(ReactNative.Alert.alert).toHaveBeenCalledWith('Error', `${unexpectedErrorMessage} ${baseErrorMessage}`);
      });
    });

    it('should show specific error message if request has it', () => {
      serverResponse = { error: 'test' };

      return API_CALLS[REQUESTS.ADD_NEW_PERSON.name]({}, {}).catch(() => {
        expect(ReactNative.Alert.alert).toHaveBeenCalledWith('Error', `${REQUESTS.ADD_NEW_PERSON.errorMessage} ${baseErrorMessage}`);
      });
    });
  });
});