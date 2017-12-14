import merge from 'lodash/merge';
import qs from 'qs';

const API_VERSION = 'v4';
let baseUrl = '';
if (__DEV__) {
  baseUrl = 'https://api-stage.missionhub.com';
} else {
  baseUrl = 'https://api-stage.missionhub.com';
}

export const BASE_URL = baseUrl;
export const API_URL = BASE_URL + `/apis/${API_VERSION}/`;

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const ERROR_CODES = [400, 401, 402, 403, 404, 500, 504];
export function handleResponse(response) {
  if (!response) return null;
  if (response && ERROR_CODES.includes(response.status)) {
    // TODO: Determine the right way to get the error response
    throw new Error(`Status code: ${response.status}`);
    // json(response).then((response2) => {
    //   LOG('response2', response2);
    //   Promise.reject(response2);
    // });
  } else {
    return json(response);
    // return response;
  }
}

export function json(response) {
  return response.text().then((t) => t ? JSON.parse(t) : null);
}

function createUrl(url = '', params) {
  let newUrl = url + '';
  if (newUrl[0] === '/') {
    newUrl = newUrl.substr(1);
  }
  let fullUrl = newUrl;
  if (params && Object.keys(params).length > 0) {
    let paramsStr = qs.stringify(params);
    // let paramsStr = Object.keys(params).map((p) => `${p}=${params[p]}`).join('&');
    // if (paramsStr) {
    // fullUrl += `?${paramsStr}`;
    // }
    fullUrl += `?${paramsStr}`;
  }
  return fullUrl;
}

function defaultObject(method, obj = {}, data) {
  let newObj = merge({}, { headers: DEFAULT_HEADERS }, obj, { method: method.toUpperCase() });
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
  APILOG('REQUEST', newObject.method, newUrl, newObject); // eslint-disable-line

  return fetch(newUrl, newObject).then(handleResponse);
}
