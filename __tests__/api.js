import API_CALLS from '../src/api';
import * as utils from '../src/api/utils';
import { REQUESTS } from '../src/actions/api';

let serverResponse = {};

beforeEach(() => {
  global.APILOG = jest.fn();
  global.LOG = jest.fn();

  utils.default = () => Promise.reject(serverResponse);
  expect.assertions(1);
});

const request = REQUESTS.GET_ME;

it('should return apiError object for api errors', () => {
  const response = { error: 'test' };
  serverResponse = response;

  return API_CALLS[request.name]({}, {}).catch((error) => {
    expect(error).toEqual({
      apiError: response,
      endpoint: request.endpoint,
      key: request.name,
      method: 'get',
      query: {},
    });
  });
});
