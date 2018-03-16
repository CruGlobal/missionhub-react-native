import moment from 'moment';
import { BackHandler, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import lodash from 'lodash';
import { navigatePush } from '../actions/navigation';
import { DRAWER_OPEN, MAIN_MENU_DRAWER, ORG_PERMISSIONS } from '../constants';

export const getFourRandomItems = (arr) => {
  if (!arr) {
    return [];
  }

  const items = [];
  const numItems = arr.length >= 4 ? 4 : arr.length;

  let x = 0;
  while (x < numItems) {
    const item = arr[Math.floor(Math.random() * arr.length)];

    if (!items.includes(item)) {
      items.push(item);
      x++;
    }
  }

  return items;
};

export const isAndroid = Platform.OS === 'android';
export const isiPhoneX = () => DeviceInfo.getModel() === 'iPhone X';
export const locale = DeviceInfo.getDeviceLocale();

export const getAnalyticsSubsection = (personId, myId) => personId === myId ? 'self' : 'person';
export const openMainMenu = () => navigatePush(DRAWER_OPEN, { drawer: MAIN_MENU_DRAWER });
export const buildTrackingObj = (name, section, subsection, level3) => {
  return {
    name: name,
    section: section,
    subsection: subsection,
    level3: level3,
  };
};

export const isFunction = (fn) => typeof fn === 'function';
export const isArray = (arr) => Array.isArray(arr);
export const isObject = (obj) => typeof obj === 'object' && !isArray(obj);
export const isString = (str) => typeof str === 'string';

export const exists = (v) => typeof v !== 'undefined';
export const clone = (obj) => JSON.parse(JSON.stringify(obj));
export const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

export const refresh = (obj, method) => {
  obj.setState({ refreshing: true });
  method().then(() => {
    obj.setState({ refreshing: false });
  }).catch(() => {
    obj.setState({ refreshing: false });
  });
};

export const isLoggedIn = (authState) => authState.token && authState.isLoggedIn;
export const isMissionhubUser = (orgPermission) => !!orgPermission && ORG_PERMISSIONS.includes(orgPermission.permission_id);

export const findAllNonPlaceHolders = (jsonApiResponse, type) =>
  jsonApiResponse.findAll(type)
    .filter((element) => !element._placeHolder);

// Pull dates out of UTC format into a moment object
export const momentUtc = (time) => moment.utc(time, 'YYYY-MM-DD HH:mm:ss UTC');
export const formatApiDate = (date) => moment(date).utc().format();

export const getInitials = (initials) => (initials || '').trim().substr(0, 2).trim();
export const intToStringLocale = (num) => parseInt(num).toLocaleString();

// Disable the android back button
const disableBackPress = () => true;
export const disableBack = {
  add: () => BackHandler.addEventListener('hardwareBackPress', disableBackPress),
  remove: () => BackHandler.removeEventListener('hardwareBackPress', disableBackPress),
};

export const merge = lodash.merge;
export const capitalize = lodash.capitalize;

export const useFirstExists = (...args) => {
  for (let i = 0; i < args.length; i++) {
    if (exists(args[i])) return args[i];
  }
  return null;
};

// Return true if the object's props are all the same
export const isEquivalentObject = (a, b) => {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};
