/* eslint-disable max-params */

import qs from 'qs';
import Config from 'react-native-config';

const API_VERSION = 'v4';

export const BASE_URL = Config.API_BASE_URL;
export const API_URL = `${BASE_URL}/apis/${API_VERSION}`;
export const THE_KEY_URL = Config.THE_KEY_URL;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const ERROR_CODES = [
  400,
  401,
  402,
  403,
  404,
  408,
  413,
  422,
  429,
  431,
  500,
  501,
  502,
  503,
  504,
];
const JSON_CONTENT_TYPE = ['application/json', 'application/vnd.api+json'];

export type ApiErrorResponse =
  | {
      errors?: { detail?: string }[];
      error?: string;
    }
  | string;

async function handleResponse(response: Response) {
  if (!response) {
    return { jsonResponse: null, sessionHeader: '' };
  }

  if (response && ERROR_CODES.includes(response.status)) {
    // Check the content type and try to parse the error correctly based on the type
    const contentType = response.headers.get('content-type') || '';
    if (
      contentType.indexOf(JSON_CONTENT_TYPE[0]) !== -1 ||
      contentType.indexOf(JSON_CONTENT_TYPE[1]) !== -1
    ) {
      return response.json().then((r: ApiErrorResponse) => Promise.reject(r));
    }
    return response.text().then((r: ApiErrorResponse) => Promise.reject(r));
  }

  // We need to use response.text() and JSON.parse(t) for responses because we are getting data back with
  // a content-type of 'application/vnd.api+json' which needs to be handled like this
  const text = await response.text();
  return {
    jsonResponse: text ? JSON.parse(text) : null,
    sessionHeader: response.headers.get('X-MH-Session'),
  };
}

function createUrl(url = '', params: {}) {
  let newUrl = `${url}`;
  if (newUrl[0] === '/') {
    newUrl = newUrl.substr(1);
  }
  let fullUrl = newUrl;
  if (params && Object.keys(params).length > 0) {
    // stringify arrays into brackets without indices https://github.com/ljharb/qs#stringifying
    const paramsStr = qs.stringify(params, { arrayFormat: 'brackets' });

    fullUrl += `?${paramsStr}`;
  }
  return fullUrl;
}

const defaultObject = (
  method: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra: RequestInit,
  data: {} | BodyInit | undefined,
  stringify = true,
): RequestInit => ({
  ...extra,
  headers: { ...DEFAULT_HEADERS, ...(extra.headers ? extra.headers : {}) },
  method: method.toUpperCase(),
  ...(data
    ? {
        body: stringify === false ? (data as BodyInit) : JSON.stringify(data),
      }
    : {}),
});

export default async function request(
  type: string,
  url: string,
  query: {},
  data: {} | undefined,
  extra: RequestInit,
  stringify: boolean = true,
) {
  const newUrl = createUrl(url, query);
  const newObject = defaultObject(type, extra, data, stringify);
  // @ts-ignore
  APILOG('REQUEST', newObject.method, newUrl, newObject);

  const response = await fetch(newUrl, newObject);
  return handleResponse(response);
}
