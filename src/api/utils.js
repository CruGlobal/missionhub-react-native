import merge from 'lodash/merge';
import qs from 'qs';
import Config from 'react-native-config';

const API_VERSION = 'v4';

export const BASE_URL = Config.API_BASE_URL;
export const API_URL = `${BASE_URL}/apis/${API_VERSION}/`;
export const THE_KEY_URL = Config.THE_KEY_URL;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const ERROR_CODES = [400, 401, 402, 403, 404, 500, 504];

function handleResponse(response) {
  if (!response) {
    return null;
  }

  if (response && ERROR_CODES.includes(response.status)) {
    return response.json().then(jsonResponse => Promise.reject(jsonResponse));
  }

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
    let paramsStr = qs.stringify(params);

    fullUrl += `?${paramsStr}`;
  }
  return fullUrl;
}

function defaultObject(method, obj = {}, data) {
  let newObj = merge({}, { headers: DEFAULT_HEADERS }, obj, {
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
  delete obj.stringify;

  return newObj;
}

export default function request(type, url, query, data, extra) {
  const newUrl = createUrl(url, query);
  const newObject = defaultObject(type, extra, data);
  APILOG('REQUEST', newObject.method, newUrl, newObject);
  return fetch(newUrl, newObject).then(handleResponse);
}
