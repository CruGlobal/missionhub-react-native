import request from '../utils';

const sessionKey = 'X-MH-Session';

const requestObj = {
  type: 'post',
  url: 'https://hellworld.com',
  query: { person_id: 1001 },
  data: {
    person: { name: 'roger' },
  },
};

const mockSessionHeader =
  'afkljasdflasdfjkllkasdflkladsfnkjnldskjnlsdjoapjopfpjosadpjoadsjfojoadfsojpdsafjodasklnasdf';
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

it('should return session header and empty response object if there was no body', async () => {
  mockResponseBody = null;

  const response = await request(
    requestObj.type,
    requestObj.url,
    requestObj.query,
    requestObj.data,
    undefined,
  );

  expect(response).toEqual({
    jsonResponse: null,
    sessionHeader: mockSessionHeader,
  });
  expect(mockResponse.text).toHaveBeenCalled();
  expect(mockResponse.headers.get).toHaveBeenCalledWith(sessionKey);
});

it('should return session header and response object if there was a body', async () => {
  const responseField = 'newPerson';
  const responseValue = 'roger';
  mockResponseBody = `{ "${responseField}": "${responseValue}" }`;

  const response = await request(
    requestObj.type,
    requestObj.url,
    requestObj.query,
    requestObj.data,
    undefined,
  );

  expect(response).toEqual({
    jsonResponse: { [responseField]: responseValue },
    sessionHeader: mockSessionHeader,
  });
  expect(mockResponse.text).toHaveBeenCalled();
  expect(mockResponse.headers.get).toHaveBeenCalledWith(sessionKey);
});

it('should return null if no response', async () => {
  const responseField = 'newPerson';
  const responseValue = 'roger';
  mockResponseBody = `{ "${responseField}": "${responseValue}" }`;
  global.fetch = jest.fn(() => Promise.resolve());

  const response = await request(
    requestObj.type,
    requestObj.url,
    requestObj.query,
    requestObj.data,
    undefined,
  );

  expect(response).toEqual(null);
});

it('should reject with response if application json', async () => {
  const responseField = 'newPerson';
  const responseValue = 'roger';
  const mock2ResponseBody = `{ "${responseField}": "${responseValue}" }`;
  const mock2SessionHeader = 'application/json';
  const mock2Response = {
    json: jest.fn(() => Promise.resolve(mock2ResponseBody)),
    headers: { get: jest.fn(() => mock2SessionHeader) },
    status: 500,
  };
  global.fetch = jest.fn(() => Promise.resolve(mock2Response));

  try {
    await request(
      requestObj.type,
      requestObj.url,
      requestObj.query,
      requestObj.data,
      undefined,
    );
  } catch (e) {
    expect(e).toEqual(mock2ResponseBody);
  }
});

it('should reject with response if application vnd.api+json', async () => {
  const responseField = 'newPerson';
  const responseValue = 'roger';
  const mock2ResponseBody = `{ "${responseField}": "${responseValue}" }`;
  const mock2SessionHeader = 'application/vnd.api+json';
  const mock2Response = {
    json: jest.fn(() => Promise.resolve(mock2ResponseBody)),
    headers: { get: jest.fn(() => mock2SessionHeader) },
    status: 500,
  };
  global.fetch = jest.fn(() => Promise.resolve(mock2Response));

  try {
    await request(
      requestObj.type,
      requestObj.url,
      requestObj.query,
      requestObj.data,
      undefined,
    );
  } catch (e) {
    expect(e).toEqual(mock2ResponseBody);
  }
});

it('should reject with response if html', async () => {
  const responseField = 'newPerson';
  const responseValue = 'roger';
  const mock2ResponseBody = `{ "${responseField}": "${responseValue}" }`;
  const mock2SessionHeader = 'text/html';
  const mock2Response = {
    text: jest.fn(() => Promise.resolve(mock2ResponseBody)),
    headers: { get: jest.fn(() => mock2SessionHeader) },
    status: 500,
  };
  global.fetch = jest.fn(() => Promise.resolve(mock2Response));

  try {
    await request(
      requestObj.type,
      requestObj.url,
      requestObj.query,
      requestObj.data,
      undefined,
    );
  } catch (e) {
    expect(e).toEqual(mock2ResponseBody);
  }
});
