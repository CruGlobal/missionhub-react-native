import merge from 'lodash/merge';
// import RNFetchBlob from 'react-native-fetch-blob';
import CONSTANTS from '../constants';

let baseUrl;
let authUrl;


const API_VERSION = 'v1';

let domain = '';
if (!CONSTANTS.IS_STAGING) {
  // setTimeout(() => LOG('POINTING TO PROD'), 1);
  domain = '';
} else {
  // setTimeout(() => LOG('POINTING TO STAGING'), 1);
  domain = '-stage';
}

baseUrl = `https://api${domain}.vokeapp.com/api/messenger/${API_VERSION}`;
authUrl = `https://auth${domain}.vokeapp.com`;

export const BASE_URL = baseUrl;
export const API_URL = BASE_URL + '/';
export const AUTH_URL = authUrl + '/';
export const SOCKET_URL = `wss://api${domain}.vokeapp.com/`;

// setTimeout(() => LOG('API_URL', API_URL), 1);

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export function json(response) {
  return response.json ? response.json() : response;
}

function createUrl(url = '', params) {
  let newUrl = url + '';
  if (newUrl[0] === '/') {
    newUrl = newUrl.substr(1);
  }
  let fullUrl = newUrl;
  if (params && Object.keys(params).length > 0) {
    let paramsStr = Object.keys(params).map((p) => `${p}=${params[p]}`).join('&');
    if (paramsStr) {
      fullUrl += `?${paramsStr}`;
    }
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

function imageUpload(url, headers, data) {
  return RNFetchBlob.fetch('PUT', url, {
    Authorization: headers.Authorization,
    'Content-Type': 'multipart/form-data',
  }, [data]).then(json).then((resp) => resp.data).catch((err) => {
    LOG('fetch blob err', err);
    return err;
  });
}

export default function request(type, url, query, data, extra) {
  const newUrl = createUrl(url, query);
  const newObject = defaultObject(type, extra, data);
  // LOG('REQUEST: ', newObject.method, newUrl, newObject); // eslint-disable-line

  // If user is trying to make an image upload request, use custom function
  if (extra.imageUpload) {
    return imageUpload(newUrl, newObject.headers, data);
  }
  return fetch(newUrl, newObject).then(json).catch((err) => {
    LOG('fetch err', err);
    return err;
  });
}
