import moment from 'moment';
import DeviceInfo from 'react-native-device-info';

export const isiPhoneX = () => DeviceInfo.getModel() === 'iPhone X';

export const isFunction = (fn) => typeof fn === 'function';
export const isArray = (arr) => Array.isArray(arr);
export const isObject = (obj) => typeof obj === 'object' && !isArray(obj);
export const isString = (str) => typeof str === 'string';

export const exists = (v) => typeof v !== 'undefined';
export const clone = (obj) => JSON.parse(JSON.stringify(obj));
export const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// Pull dates out of UTC format into a moment object
export const momentUtc = (time) => moment.utc(time, 'YYYY-MM-DD HH:mm:ss UTC');

export const getInitials = (initials) => (initials || '').trim().substr(0, 2).trim();

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
