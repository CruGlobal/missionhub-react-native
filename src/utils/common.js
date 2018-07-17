import moment from 'moment';
import { BackHandler, Platform } from 'react-native';
import { DrawerActions } from 'react-navigation';
import * as DeviceInfo from 'react-native-device-info';
import lodash from 'lodash';
import { Linking } from 'react-native';

import {
  CUSTOM_STEP_TYPE,
  MAIN_MENU_DRAWER,
  ORG_PERMISSIONS,
  INTERACTION_TYPES,
  DEFAULT_PAGE_LIMIT,
} from '../constants';
import { trackActionWithoutData } from '../actions/analytics';

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
export const buildTrackingObj = (name, section, subsection, level3) => {
  return {
    name: name,
    section: section,
    subsection: subsection,
    level3: level3,
  };
};

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

const MHUB_PERMISSIONS = [ORG_PERMISSIONS.ADMIN, ORG_PERMISSIONS.USER];
export const isMissionhubUser = orgPermission =>
  !!orgPermission && MHUB_PERMISSIONS.includes(orgPermission.permission_id);
export const isAdminForOrg = orgPermission =>
  !!orgPermission && orgPermission.permission_id === ORG_PERMISSIONS.ADMIN;

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

export const getFilterOptions = (t, filters) => ({
  questions: {
    id: 'questions',
    text: t('searchFilter:surveyQuestions'),
    options: 'questions',
    preview: filters.questions ? filters.questions.text : undefined,
  },
  gender: {
    id: 'gender',
    text: t('searchFilter:gender'),
    options: [
      { id: 'm', text: t('searchFilter:male') },
      { id: 'f', text: t('searchFilter:female') },
      { id: 'o', text: t('searchFilter:other') },
    ],
    preview: filters.gender ? filters.gender.text : undefined,
  },
  time: {
    id: 'time',
    text: t('searchFilter:time'),
    options: [
      { id: 'time7', text: t('searchFilter:time7') },
      { id: 'time30', text: t('searchFilter:time30') },
      { id: 'time60', text: t('searchFilter:time60') },
      { id: 'time90', text: t('searchFilter:time90') },
      { id: 'time180', text: t('searchFilter:time180') },
      { id: 'time270', text: t('searchFilter:time270') },
      { id: 'time365', text: t('searchFilter:time365') },
    ],
    preview: filters.time ? filters.time.text : undefined,
  },
  uncontacted: {
    id: 'uncontacted',
    text: t('searchFilter:uncontacted'),
    selected: !!filters.uncontacted,
  },
  unassigned: {
    id: 'unassigned',
    text: t('searchFilter:unassigned'),
    selected: !!filters.unassigned,
  },
  archived: {
    id: 'archived',
    text: t('searchFilter:archived'),
    selected: !!filters.archived,
  },
});

export const searchHandleToggle = (scope, item) => {
  const { toggleOptions, filters } = scope.state;
  if (!item) return;
  let newFilter = { ...filters };
  const field = item.id;
  const newValue = !item.selected;
  newFilter[field] = newValue ? { ...item, selected: true } : undefined;
  const newToggleOptions = toggleOptions.map(o => ({
    ...o,
    selected: o.id === item.id ? newValue : o.selected,
  }));
  scope.setState({ toggleOptions: newToggleOptions });
  scope.setFilter(newFilter);
};

export const searchSelectFilter = (scope, item) => {
  const { options, selectedFilterId, filters } = scope.state;
  const newOptions = options.map(o => ({
    ...o,
    preview: o.id === selectedFilterId ? item.text : o.preview,
  }));
  let newFilters = {
    ...filters,
    [selectedFilterId]: item,
  };
  if (item.id === 'any') {
    delete newFilters[selectedFilterId];
  }
  scope.setState({ options: newOptions });
  scope.setFilter(newFilters);
};

export const searchRemoveFilter = async (
  scope,
  key,
  defaultFilterKeys = [],
) => {
  let newFilters = { ...scope.state.filters };
  delete newFilters[key];
  let newState = { filters: newFilters };
  // If one of the default filters is removed, remove the default contacts to show
  if (defaultFilterKeys.includes(key)) {
    newState.defaultResults = [];
  }
  return await new Promise(resolve =>
    scope.setState(newState, () => resolve()),
  );
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
export function showAssignButton(personIsCurrentUser, contactAssignment) {
  return !personIsCurrentUser && !contactAssignment;
}
export function showUnassignButton(
  personIsCurrentUser,
  contactAssignment,
  isJean,
  orgPermission,
) {
  return !personIsCurrentUser && contactAssignment && isJean && orgPermission;
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
      ) ||
        person.phone_numbers.find(phone_number => !phone_number._placeHolder) ||
        null
    : null;
}

export function getPersonEmailAddress(person) {
  return person.email_addresses
    ? person.email_addresses.find(
        email => email.primary && !email._placeHolder,
      ) ||
        person.email_addresses.find(email => !email._placeHolder) ||
        null
    : null;
}

export function openCommunicationLink(url, dispatch, action) {
  //if someone has a better name for this feel free to suggest.
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        WARN("Can't handle url: ", url);
      } else {
        Linking.openURL(url)
          .then(() => {
            dispatch(trackActionWithoutData(action));
          })
          .catch(err => {
            if (url.includes('telprompt')) {
              // telprompt was cancelled and Linking openURL method sees this as an error
              // it is not a true error so ignore it to prevent apps crashing
            } else {
              WARN('openURL error', err);
            }
          });
      }
    })
    .catch(err => WARN('An unexpected error happened', err));
}

export function getStageIndex(stages, stageId) {
  const firstItemIndex = stages.findIndex(s => s && `${s.id}` === `${stageId}`);

  return firstItemIndex >= 0 ? firstItemIndex : undefined;
}
