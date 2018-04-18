import request from '../../src/api/utils';

const sessionKey = 'x-mh-session';

const requestObj = {
  type: 'post',
  url: 'https://hellworld.com',
  query: { person_id: 1001 },
  data: {
    person: { name: 'roger' },
  },
};

const mockSessionHeader = 'afkljasdflasdfjkllkasdflkladsfnkjnldskjnlsdjoapjopfpjosadpjoadsjfojoadfsojpdsafjodasklnasdf';
let mockResponseBody;
const mockResponse = {
  text: jest.fn(() => Promise.resolve(mockResponseBody)),
  headers: { get: jest.fn(() => mockSessionHeader) },
};

global.APILOG = jest.fn();
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

beforeEach(() => {
  mockResponse.text.mockClear();
  mockResponse.headers.get.mockClear();
});

it('should return session header and empty response object if there was no body', async() => {
  mockResponseBody = null;

  const response = await request(requestObj.type, requestObj.url, requestObj.query, requestObj.data, undefined);

  expect(response).toEqual({ jsonResponse: null, sessionHeader: mockSessionHeader });
  expect(mockResponse.text).toHaveBeenCalled();
  expect(mockResponse.headers.get).toHaveBeenCalledWith(sessionKey);
});

it('should return session header and response object if there was a body', async() => {
  const responseField = 'newPerson';
  const responseValue = 'roger';
  mockResponseBody = `{ "${responseField}": "${responseValue}" }`;

  const response = await request(requestObj.type, requestObj.url, requestObj.query, requestObj.data, undefined);

  expect(response).toEqual({ jsonResponse: { [responseField]: responseValue }, sessionHeader: mockSessionHeader });
  expect(mockResponse.text).toHaveBeenCalled();
  expect(mockResponse.headers.get).toHaveBeenCalledWith(sessionKey);
});
