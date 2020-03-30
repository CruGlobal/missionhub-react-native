/* eslint max-lines: 0, max-params: 0 */

import {
  ToastAndroid,
  BackHandler,
  Platform,
  Keyboard,
  Clipboard,
} from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Config from 'react-native-config';
import i18n from 'i18next';

import {
  CUSTOM_STEP_TYPE,
  MAIN_MENU_DRAWER,
  ORG_PERMISSIONS,
  INTERACTION_TYPES,
  DEFAULT_PAGE_LIMIT,
  ACCEPTED_STEP,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import { PermissionEnum } from '../../__generated__/globalTypes';
import { StagesState } from '../reducers/stages';

// @ts-ignore
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

// @ts-ignore
export const getAnalyticsSubsection = (personId, myId) =>
  personId === myId ? 'self' : 'person';
export const openMainMenu = () => {
  // @ts-ignore
  return dispatch => {
    dispatch(DrawerActions.openDrawer({ drawer: MAIN_MENU_DRAWER }));
  };
};
export const buildTrackingObj = (
  // @ts-ignore
  name,
  // @ts-ignore
  section,
  // @ts-ignore
  subsection,
  // @ts-ignore
  level3,
  // @ts-ignore
  level4,
) => ({
  name,
  section,
  subsection,
  level3,
  level4,
});

// @ts-ignore
export const isFunction = fn => typeof fn === 'function';
// @ts-ignore
export const isArray = arr => Array.isArray(arr);
// @ts-ignore
export const isObject = obj => typeof obj === 'object' && !isArray(obj);
// @ts-ignore
export const isString = str => typeof str === 'string';

// @ts-ignore
export const exists = v => typeof v !== 'undefined';
// @ts-ignore
export const clone = obj => JSON.parse(JSON.stringify(obj));
// @ts-ignore
export const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

// @ts-ignore
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

// @ts-ignore
export const isAuthenticated = authState => authState.token;

//If the user has permissions in a Cru Community (that is, user_created === false), they are Jean
// @ts-ignore
export const userIsJean = orgPermissions =>
  // @ts-ignore
  orgPermissions.some(p => !p.organization.user_created);

// @ts-ignore
export const orgIsPersonalMinistry = org =>
  org && (!org.id || org.id === 'personal');
// @ts-ignore
export const orgIsUserCreated = org =>
  !!(org && (org.user_created || org.userCreated));
// @ts-ignore
export const orgIsGlobal = org => org && org.id === GLOBAL_COMMUNITY_ID;
// @ts-ignore
export const orgIsCru = org =>
  org &&
  !orgIsPersonalMinistry(org) &&
  !orgIsUserCreated(org) &&
  !orgIsGlobal(org);

const MHUB_PERMISSIONS = [
  ORG_PERMISSIONS.OWNER,
  ORG_PERMISSIONS.ADMIN,
  ORG_PERMISSIONS.USER,
  PermissionEnum.admin,
  PermissionEnum.owner,
  PermissionEnum.user,
];

// @ts-ignore
export const hasOrgPermissions = orgPermission => {
  return (
    (!!orgPermission &&
      MHUB_PERMISSIONS.includes(`${orgPermission.permission_id}`)) ||
    (!!orgPermission && MHUB_PERMISSIONS.includes(orgPermission.permission))
  );
};

// @ts-ignore
export const isAdminOrOwner = orgPermission =>
  (!!orgPermission &&
    [ORG_PERMISSIONS.ADMIN, ORG_PERMISSIONS.OWNER].includes(
      `${orgPermission.permission_id}`,
    )) ||
  (!!orgPermission &&
    [PermissionEnum.admin, PermissionEnum.owner].includes(
      orgPermission.permission,
    ));
// @ts-ignore
export const isOwner = orgPermission =>
  (!!orgPermission &&
    `${orgPermission.permission_id}` === ORG_PERMISSIONS.OWNER) ||
  (!!orgPermission && orgPermission.permission === PermissionEnum.owner);
// @ts-ignore
export const isAdmin = orgPermission =>
  (!!orgPermission &&
    `${orgPermission.permission_id}` === ORG_PERMISSIONS.ADMIN) ||
  (!!orgPermission && orgPermission.permission === PermissionEnum.admin);

// @ts-ignore
export const shouldQueryReportedComments = (org, orgPermission) =>
  (orgIsCru(org) && isAdminOrOwner(orgPermission)) ||
  (orgIsUserCreated(org) && isOwner(orgPermission));

// @ts-ignore
export const isCustomStep = step => step.challenge_type === CUSTOM_STEP_TYPE;

// @ts-ignore
export const findAllNonPlaceHolders = (jsonApiResponse, type) =>
  // @ts-ignore
  jsonApiResponse.findAll(type).filter(element => !element._placeHolder);

// @ts-ignore
export const getInitials = initials =>
  (initials || '')
    .trim()
    .substr(0, 2)
    .trim();
// @ts-ignore
export const getFirstNameAndLastInitial = (f, l) =>
  `${f || ''} ${(l || '').charAt(0)}`.trim();
// @ts-ignore
export const intToStringLocale = num => parseInt(num).toLocaleString();

// Disable the android back button
const disableBackPress = () => true;
export const disableBack = {
  add: () =>
    BackHandler.addEventListener('hardwareBackPress', disableBackPress),
  remove: () =>
    BackHandler.removeEventListener('hardwareBackPress', disableBackPress),
};

// @ts-ignore
export const useFirstExists = (...args) => {
  for (let i = 0; i < args.length; i++) {
    if (exists(args[i])) {
      return args[i];
    }
  }
  return null;
};

// Return true if the object's props are all the same
// @ts-ignore
export const isEquivalentObject = (a, b) => {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

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
  // @ts-ignore
  key => INTERACTION_TYPES[key],
);
// For journey items, feed items, etc.
// @ts-ignore
export const getIconName = (type, interaction_type_id) => {
  if (type === ACCEPTED_STEP) {
    return 'stepsIcon';
  } else if (type === 'pathway_progression_audit') {
    return 'journeyIcon';
  } else if (type === 'answer_sheet') {
    return 'surveyIcon';
  } else if (type === 'contact_assignment') {
    return 'statusIcon';
  } else if (type === 'contact_unassignment') {
    return 'statusIcon';
  } else if (type === 'interaction') {
    const interaction = interactionsArr.find(
      i => i.id === `${interaction_type_id}`,
    );
    if (interaction) {
      return interaction.iconName;
    }
  }
  return null;
};

// @ts-ignore
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
  // @ts-ignore
  isCruOrg,
  // @ts-ignore
  personIsCurrentUser,
  // @ts-ignore
  contactAssignment,
) {
  return isCruOrg && !personIsCurrentUser && !contactAssignment;
}
// @ts-ignore
export function showUnassignButton(isCruOrg, contactAssignment) {
  return isCruOrg && contactAssignment;
}
export function showDeleteButton(
  // @ts-ignore
  personIsCurrentUser,
  // @ts-ignore
  contactAssignment,
  // @ts-ignore
  orgPermission,
) {
  return !personIsCurrentUser && contactAssignment && !orgPermission;
}

// @ts-ignore
export function getAssignedToName(myId, item) {
  const assigned_to = item.assigned_to;

  return myId === assigned_to.id ? 'You' : assigned_to.first_name;
}

// @ts-ignore
export function getAssignedByName(myId, item) {
  const assigned_by = item.assigned_by;

  return assigned_by
    ? myId === assigned_by.id
      ? ' by You'
      : ` by ${assigned_by.first_name}`
    : '';
}

// @ts-ignore
export function getPersonPhoneNumber(person) {
  return person.phone_numbers
    ? person.phone_numbers.find(
        // @ts-ignore
        phone_number => phone_number.primary && !phone_number._placeHolder,
        // @ts-ignore
      ) || person.phone_numbers.find(phone_number => !phone_number._placeHolder)
    : null;
}

// @ts-ignore
export function getPersonEmailAddress(person) {
  return person.email_addresses
    ? person.email_addresses.find(
        // @ts-ignore
        email => email.primary && !email._placeHolder,
        // @ts-ignore
      ) || person.email_addresses.find(email => !email._placeHolder)
    : null;
}

export function getStageIndex(stages: StagesState['stages'], stageId: string) {
  const index = (stages || []).findIndex(s => s && `${s.id}` === `${stageId}`);

  return index === -1 ? undefined : index;
}

// iOS and Android handle the keyboard show event differently
// https://facebook.github.io/react-native/docs/keyboard#addlistener
// @ts-ignore
export function keyboardShow(handler, type) {
  if (isAndroid || type === 'did') {
    return Keyboard.addListener('keyboardDidShow', handler);
  }
  return Keyboard.addListener('keyboardWillShow', handler);
}

// @ts-ignore
export function keyboardHide(handler, type) {
  if (isAndroid || type === 'did') {
    return Keyboard.addListener('keyboardDidHide', handler);
  }
  return Keyboard.addListener('keyboardWillHide', handler);
}

// @ts-ignore
export function getSurveyUrl(surveyId) {
  return `${Config.SURVEY_URL}${surveyId}`;
}

// @ts-ignore
export function getCommunityUrl(link) {
  return link ? `${Config.COMMUNITY_URL}${link}` : '';
}

// @ts-ignore
export function toast(text, duration) {
  if (isAndroid) {
    const toastDuration =
      duration === 'long' ? ToastAndroid.LONG : ToastAndroid.SHORT;
    ToastAndroid.show(text, toastDuration);
  }
}

// @ts-ignore
export function copyText(string) {
  Clipboard.setString(string);
  // @ts-ignore
  toast(i18n.t('copyMessage'));
}

export const keyExtractorId = ({ id }: { id: string }) => id;
