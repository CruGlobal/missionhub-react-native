import API_CALLS from '../../src/api/index';
import * as utils from '../../src/api/utils';
import { REQUESTS } from '../../src/actions/api';

beforeEach(() => {
  global.APILOG = jest.fn();
  global.LOG = jest.fn();

  expect.assertions(1);
});

const request = REQUESTS.GET_ME;
const sessionHeader = 'alknaskpfsdksadnsakdfpajsdfkpasfdpoasmokfnosafonpiwqijoijojiojiosadmosafpnosdfniopsadfmioasdf';

it('should return apiError object for api errors', async() => {
  const response = { error: 'test' };
  utils.default = () => Promise.reject(response);

  try {
    await API_CALLS[request.name]({}, {});
  } catch (error) {
    expect(error).toEqual({
      apiError: response,
      endpoint: request.endpoint,
      key: request.name,
      method: 'get',
      query: {},
    });
  }
});

it('should return session header with empty response', async() => {
  utils.default = () => Promise.resolve({ jsonResponse: null, sessionHeader });

  const response = await API_CALLS[request.name]({}, {});
  expect(response).toEqual({ sessionHeader });
});

describe('response is not empty', () => {
  it('should sync with JsonApiDataStore if the request prescribes', async() => {
    const jsonResponse = {
      data: {},
      meta: 'some meta',
    };
    utils.default = () => Promise.resolve({ jsonResponse, sessionHeader });

    const response = await API_CALLS[request.name]({}, {});

    expect(response).toEqual({
      meta: jsonResponse.meta,
      response: expect.anything(),
      results: expect.anything(),
      sessionHeader,
    });
  });
});
