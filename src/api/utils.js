import merge from 'lodash/merge';
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

function handleResponse(response) {
  if (!response) {
    return null;
  }

  if (response && ERROR_CODES.includes(response.status)) {
    // Check the content type and try to parse the error correctly based on the type
    const contentType = response.headers.get('content-type') || '';
    if (
      contentType.indexOf(JSON_CONTENT_TYPE[0]) !== -1 ||
      contentType.indexOf(JSON_CONTENT_TYPE[1]) !== -1
    ) {
      return response.json().then(r => Promise.reject(r));
    }
    return response.text().then(r => Promise.reject(r));
  }

  // We need to use response.text() and JSON.parse(t) for responses because we are getting data back with
  // a content-type of 'application/vnd.api+json' which needs to be handled like this
  return response.text().then(t => ({
    jsonResponse: t ? JSON.parse(t) : null,
    sessionHeader: response.headers.get('X-MH-Session'),
  }));
}

function createUrl(url = '', params) {
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

function defaultObject(method, obj = {}, data) {
  const newObj = merge({}, { headers: DEFAULT_HEADERS }, obj, {
    method: method.toUpperCase(),
  });
  if (obj && obj.headers && obj.headers['Content-Type'] === false) {
    delete newObj.headers['Content-Type'];
  }
  if (obj && obj.headers && obj.headers['Accept'] === false) {
    delete newObj.headers['Accept'];
  }
  if (data) {
    newObj.body = obj.stringify === false ? data : JSON.stringify(data);
  }
  delete newObj.stringify;

  return newObj;
}

export default function request(type, url, query, data, extra) {
  const newUrl = createUrl(url, query);
  const newObject = defaultObject(type, extra, data);
  APILOG('REQUEST', newObject.method, newUrl, newObject);

  return fetch(newUrl, newObject).then(handleResponse);
}
