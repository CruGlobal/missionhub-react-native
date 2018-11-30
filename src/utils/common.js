import moment from 'moment';
import {
  ToastAndroid,
  BackHandler,
  Platform,
  Keyboard,
  Clipboard,
} from 'react-native';
import { DrawerActions } from 'react-navigation';
import * as DeviceInfo from 'react-native-device-info';
import lodash from 'lodash';
import Config from 'react-native-config';

import {
  CUSTOM_STEP_TYPE,
  MAIN_MENU_DRAWER,
  ORG_PERMISSIONS,
  INTERACTION_TYPES,
  DEFAULT_PAGE_LIMIT,
} from '../constants';
import i18n from '../i18n';

export const shuffleArray = arr => {
  let i, temporaryValue, randomIndex;

  for (i = arr.length; i > 0; i -= 1) {
    randomIndex = Math.floor(Math.random() * i);

    temporaryValue = arr[i - 1];
    arr[i - 1] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
};

export const isAndroid = Platform.OS === 'android';
export const isiPhoneX = () => DeviceInfo.getModel() === 'iPhone X';
export const locale = DeviceInfo.getDeviceLocale();

export const getAnalyticsSubsection = (personId, myId) =>
  personId === myId ? 'self' : 'person';
export const openMainMenu = () =>
  DrawerActions.openDrawer({ drawer: MAIN_MENU_DRAWER });
export const buildTrackingObj = (name, section, subsection, level3) => ({
  name,
  section,
  subsection,
  level3,
});

export const isFunction = fn => typeof fn === 'function';
export const isArray = arr => Array.isArray(arr);
export const isObject = obj => typeof obj === 'object' && !isArray(obj);
export const isString = str => typeof str === 'string';

export const exists = v => typeof v !== 'undefined';
export const clone = obj => JSON.parse(JSON.stringify(obj));
export const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export const refresh = (obj, method) => {
  obj.setState({ refreshing: true });
  method()
    .then(() => {
      obj.setState({ refreshing: false });
    })
    .catch(() => {
      obj.setState({ refreshing: false });
    });
};

export const isAuthenticated = authState => authState.token;

//If the user has permissions in a Cru Community (that is, user_created === false), they are Jean
export const userIsJean = orgPermissions =>
  orgPermissions.some(p => !p.organization.user_created);

export const orgIsPersonalMinistry = org =>
  org && (!org.id || org.id === 'personal');
export const orgIsUserCreated = org => !!(org && org.user_created);
export const orgIsCru = org =>
  org && !orgIsPersonalMinistry(org) && !orgIsUserCreated(org);

const MHUB_PERMISSIONS = [
  ORG_PERMISSIONS.OWNER,
  ORG_PERMISSIONS.ADMIN,
  ORG_PERMISSIONS.USER,
];
export const hasOrgPermissions = orgPermission =>
  !!orgPermission && MHUB_PERMISSIONS.includes(orgPermission.permission_id);
export const isAdminOrOwner = orgPermission =>
  !!orgPermission &&
  [ORG_PERMISSIONS.ADMIN, ORG_PERMISSIONS.OWNER].includes(
    orgPermission.permission_id,
  );
export const isOwner = orgPermission =>
  !!orgPermission && orgPermission.permission_id === ORG_PERMISSIONS.OWNER;

export const isCustomStep = step => step.challenge_type === CUSTOM_STEP_TYPE;

export const findAllNonPlaceHolders = (jsonApiResponse, type) =>
  jsonApiResponse.findAll(type).filter(element => !element._placeHolder);

// Pull dates out of UTC format into a moment object
export const momentUtc = time => moment.utc(time, 'YYYY-MM-DD HH:mm:ss UTC');
export const formatApiDate = date =>
  moment(date)
    .utc()
    .format();

export const getInitials = initials =>
  (initials || '')
    .trim()
    .substr(0, 2)
    .trim();
export const getFirstNameAndLastInitial = (f, l) =>
  `${f || ''} ${(l || '').charAt(0)}`.trim();
export const intToStringLocale = num => parseInt(num).toLocaleString();

// Disable the android back button
const disableBackPress = () => true;
export const disableBack = {
  add: () =>
    BackHandler.addEventListener('hardwareBackPress', disableBackPress),
  remove: () =>
    BackHandler.removeEventListener('hardwareBackPress', disableBackPress),
};

export const merge = lodash.merge;
export const capitalize = lodash.capitalize;

export const useFirstExists = (...args) => {
  for (let i = 0; i < args.length; i++) {
    if (exists(args[i])) {
      return args[i];
    }
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

const interactionsArr = Object.keys(INTERACTION_TYPES).map(
  key => INTERACTION_TYPES[key],
);
// For journey items, feed items, etc.
export const getIconName = (type, interaction_type_id) => {
  if (type === 'accepted_challenge') {
    return 'stepsIcon';
  } else if (type === 'pathway_progression_audit') {
    return 'journeyIcon';
  } else if (type === 'answer_sheet') {
    return 'surveyIcon';
  } else if (type === 'contact_assignment') {
    return 'journeyWarning';
  } else if (type === 'contact_unassignment') {
    return 'journeyWarning';
  } else if (type === 'interaction') {
    const interaction = interactionsArr.find(i => i.id === interaction_type_id);
    if (interaction) {
      return interaction.iconName;
    }
  }
  return null;
};

export function getPagination(action, currentLength) {
  const offset =
    action.query && action.query.page && action.query.page.offset
      ? action.query.page.offset
      : 0;
  const pageNum = Math.floor(offset / DEFAULT_PAGE_LIMIT) + 1;
  const total = action.meta ? action.meta.total || 0 : 0;
  const hasNextPage = total > currentLength;

  return {
    page: pageNum,
    hasNextPage,
  };
}

//showing assign/unassign buttons on side menu
export function showAssignButton(
  isCruOrg,
  personIsCurrentUser,
  contactAssignment,
) {
  return isCruOrg && !personIsCurrentUser && !contactAssignment;
}
export function showUnassignButton(isCruOrg, contactAssignment) {
  return isCruOrg && contactAssignment;
}
export function showDeleteButton(
  personIsCurrentUser,
  contactAssignment,
  orgPermission,
) {
  return !personIsCurrentUser && contactAssignment && !orgPermission;
}

export function getAssignedToName(myId, item) {
  const assigned_to = item.assigned_to;

  return myId === assigned_to.id ? 'You' : assigned_to.first_name;
}

export function getAssignedByName(myId, item) {
  const assigned_by = item.assigned_by;

  return assigned_by
    ? myId === assigned_by.id
      ? ' by You'
      : ` by ${assigned_by.first_name}`
    : '';
}

export function getPersonPhoneNumber(person) {
  return person.phone_numbers
    ? person.phone_numbers.find(
        phone_number => phone_number.primary && !phone_number._placeHolder,
      ) || person.phone_numbers.find(phone_number => !phone_number._placeHolder)
    : null;
}

export function getPersonEmailAddress(person) {
  return person.email_addresses
    ? person.email_addresses.find(
        email => email.primary && !email._placeHolder,
      ) || person.email_addresses.find(email => !email._placeHolder)
    : null;
}

export function getStageIndex(stages, stageId) {
  const index = (stages || []).findIndex(s => s && `${s.id}` === `${stageId}`);

  return index === -1 ? undefined : index;
}

// iOS and Android handle the keyboard show event differently
// https://facebook.github.io/react-native/docs/keyboard#addlistener
export function keyboardShow(handler) {
  if (isAndroid) {
    return Keyboard.addListener('keyboardDidShow', handler);
  }
  return Keyboard.addListener('keyboardWillShow', handler);
}

export function keyboardHide(handler) {
  if (isAndroid) {
    return Keyboard.addListener('keyboardDidHide', handler);
  }
  return Keyboard.addListener('keyboardWillHide', handler);
}

export function getSurveyUrl(surveyId) {
  return `${Config.SURVEY_URL}${surveyId}`;
}

export function getCommunityUrl(link) {
  return `${Config.COMMUNITY_URL}${link}`;
}

export function toast(text, duration) {
  if (isAndroid) {
    const toastDuration =
      duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
    ToastAndroid.show(text, toastDuration);
  }
}

export function copyText(string) {
  Clipboard.setString(string);
  toast(i18n.t('copyMessage'));
}
