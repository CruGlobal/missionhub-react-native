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
  MAIN_MENU_DRAWER,
  ORG_PERMISSIONS,
  INTERACTION_TYPES,
  DEFAULT_PAGE_LIMIT,
  ACCEPTED_STEP,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
import { AuthState } from '../reducers/auth';
import { OnboardingState } from '../reducers/onboarding';
import {
  PermissionEnum,
  PostTypeEnum,
  FeedItemSubjectTypeEnum,
} from '../../__generated__/globalTypes';
import { StagesState } from '../reducers/stages';
import { CommunityFeedItem_subject } from '../components/CommunityFeedItem/__generated__/CommunityFeedItem';

export const isAndroid = Platform.OS === 'android';

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

export const isAuthenticated = (authState: AuthState): boolean =>
  !!authState.token;

export const personIsCurrentUser = (personId: string, authState: AuthState) =>
  personId === authState.person.id;

export const isOnboarding = (onboardingState: OnboardingState) =>
  onboardingState.currentlyOnboarding;

//If the user has permissions in a Cru Community (that is, user_created === false), they are Jean
export const userIsJean = (
  orgPermissions: { organization: { user_created: boolean } }[],
) => orgPermissions.some(p => !p.organization.user_created);

export const orgIsPersonalMinistry = (org?: { id?: string }) =>
  !!org && (!org.id || org.id === 'personal');

export const orgIsUserCreated = (org?: {
  user_created?: boolean;
  userCreated?: boolean;
}) => !!(org && (org.user_created || org.userCreated));

export const orgIsGlobal = (org?: { id?: string }) =>
  !!org && org.id === GLOBAL_COMMUNITY_ID;

export const orgIsCru = (org?: {
  id?: string;
  user_created?: boolean;
  userCreated?: boolean;
}) =>
  !!org &&
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

export const hasOrgPermissions = (
  orgPermission: {
    permission_id?: string;
    permission?: PermissionEnum;
  } | null,
) => {
  return (
    (!!orgPermission &&
      MHUB_PERMISSIONS.includes(`${orgPermission.permission_id}`)) ||
    (!!orgPermission &&
      !!orgPermission.permission &&
      MHUB_PERMISSIONS.includes(orgPermission.permission))
  );
};

export const isAdminOrOwner = (
  orgPermission:
    | {
        permission_id?: string;
        permission?: PermissionEnum;
      }
    | null
    | undefined,
) =>
  (!!orgPermission &&
    [ORG_PERMISSIONS.ADMIN, ORG_PERMISSIONS.OWNER].includes(
      `${orgPermission.permission_id}`,
    )) ||
  (!!orgPermission &&
    !!orgPermission.permission &&
    [PermissionEnum.admin, PermissionEnum.owner].includes(
      orgPermission.permission,
    ));

export const isOwner = (
  orgPermission: {
    permission_id?: string;
    permission?: PermissionEnum;
  } | null,
) =>
  (!!orgPermission &&
    `${orgPermission.permission_id}` === ORG_PERMISSIONS.OWNER) ||
  (!!orgPermission &&
    !!orgPermission.permission &&
    orgPermission.permission === PermissionEnum.owner);

export const isAdmin = (
  orgPermission: {
    permission_id?: string;
    permission?: PermissionEnum;
  } | null,
) =>
  (!!orgPermission &&
    `${orgPermission.permission_id}` === ORG_PERMISSIONS.ADMIN) ||
  (!!orgPermission &&
    !!orgPermission.permission &&
    orgPermission.permission === PermissionEnum.admin);

export const canEditCommunity = (
  permission?: PermissionEnum,
  userCreated?: boolean,
) =>
  permission === PermissionEnum.owner ||
  (!userCreated && permission === PermissionEnum.admin);

// @ts-ignore
export const shouldQueryReportedComments = (org, orgPermission) =>
  (orgIsCru(org) && isAdminOrOwner(orgPermission)) ||
  (orgIsUserCreated(org) && isOwner(orgPermission));

// @ts-ignore
export const findAllNonPlaceHolders = (jsonApiResponse, type) =>
  // @ts-ignore
  jsonApiResponse.findAll(type).filter(element => !element._placeHolder);

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

export function getPagination(
  action: { meta?: { total?: number }; query?: { page?: { offset?: number } } },
  currentLength: number,
) {
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
  isCruOrg: boolean,
  personIsCurrentUser: boolean,
  contactAssignment: { id: string },
) {
  return isCruOrg && !personIsCurrentUser && !contactAssignment;
}
export function showUnassignButton(
  isCruOrg: boolean,
  contactAssignment: { id: string },
) {
  return isCruOrg && contactAssignment;
}
export function showDeleteButton(
  personIsCurrentUser: boolean,
  contactAssignment: { id: string },
  orgPermission?: { id: string },
) {
  return !personIsCurrentUser && contactAssignment && !orgPermission;
}

// @ts-ignore
export function getAssignedToName(myId, item) {
  const assigned_to = item.assigned_to;

  return myId === assigned_to.id ? i18n.t('you') : assigned_to.first_name;
}

// @ts-ignore
export function getAssignedByName(myId, item) {
  const assigned_by = item.assigned_by;

  return assigned_by
    ? myId === assigned_by.id
      ? ` ${i18n.t('by')} ${i18n.t('you')}`
      : ` ${i18n.t('by')} ${assigned_by.first_name}`
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

export const mapPostTypeToFeedType = (postType: PostTypeEnum) => {
  switch (postType) {
    case PostTypeEnum.story:
      return FeedItemSubjectTypeEnum.STORY;
    case PostTypeEnum.prayer_request:
      return FeedItemSubjectTypeEnum.PRAYER_REQUEST;
    case PostTypeEnum.question:
      return FeedItemSubjectTypeEnum.QUESTION;
    case PostTypeEnum.help_request:
      return FeedItemSubjectTypeEnum.HELP_REQUEST;
    case PostTypeEnum.thought:
      return FeedItemSubjectTypeEnum.THOUGHT;
    case PostTypeEnum.announcement:
      return FeedItemSubjectTypeEnum.ANNOUNCEMENT;
  }
};

export const mapFeedTypeToPostType = (feedType: FeedItemSubjectTypeEnum) => {
  switch (feedType) {
    case FeedItemSubjectTypeEnum.STORY:
      return PostTypeEnum.story;
    case FeedItemSubjectTypeEnum.PRAYER_REQUEST:
      return PostTypeEnum.prayer_request;
    case FeedItemSubjectTypeEnum.QUESTION:
      return PostTypeEnum.question;
    case FeedItemSubjectTypeEnum.HELP_REQUEST:
      return PostTypeEnum.help_request;
    case FeedItemSubjectTypeEnum.THOUGHT:
      return PostTypeEnum.thought;
    case FeedItemSubjectTypeEnum.ANNOUNCEMENT:
      return PostTypeEnum.announcement;
  }
};

export const getFeedItemType = (subject: CommunityFeedItem_subject) => {
  switch (subject.__typename) {
    case 'AcceptedCommunityChallenge':
      return FeedItemSubjectTypeEnum.COMMUNITY_CHALLENGE;
    case 'Step':
      return FeedItemSubjectTypeEnum.STEP;
    case 'Post':
      return mapPostTypeToFeedType(subject.postType);
    default:
      return FeedItemSubjectTypeEnum.STORY;
  }
};
