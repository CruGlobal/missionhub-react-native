import * as utils from '../utils';
import { REQUESTS } from '../../api/routes';
import API_CALLS from '..';

beforeEach(() => {
  // @ts-ignore
  global.APILOG = jest.fn();
  // @ts-ignore
  global.LOG = jest.fn();

  expect.assertions(1);
});

const request = REQUESTS.GET_ME;
const sessionHeader =
  'alknaskpfsdksadnsakdfpajsdfkpasfdpoasmokfnosafonpiwqijoijojiojiosadmosafpnosdfniopsadfmioasdf';

it('should return apiError object for api errors', async () => {
  const response = { error: 'test' };
  // @ts-ignore
  utils.default = () => Promise.reject(response);

  await expect(API_CALLS[request.name]({}, {})).rejects.toEqual({
    apiError: response,
    endpoint: request.endpoint,
    key: request.name,
    method: 'get',
    query: {},
  });
});

it('should return session header with empty response', async () => {
  // @ts-ignore
  utils.default = () => Promise.resolve({ jsonResponse: null, sessionHeader });

  const response = await API_CALLS[request.name]({}, {});
  expect(response).toEqual({ sessionHeader });
});

describe('response is not empty', () => {
  it('should sync with JsonApiDataStore if the request prescribes', async () => {
    const jsonResponse = {
      data: {},
      meta: 'some meta',
    };
    // @ts-ignore
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
