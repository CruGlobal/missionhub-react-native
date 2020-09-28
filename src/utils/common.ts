/* eslint-disable max-lines */

import { BackHandler, Platform, Clipboard } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Config from 'react-native-config';
import i18n from 'i18next';
import Toast from 'react-native-simple-toast';

import {
  MAIN_MENU_DRAWER,
  ORG_PERMISSIONS,
  DEFAULT_PAGE_LIMIT,
  GLOBAL_COMMUNITY_ID,
} from '../constants';
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
  // eslint-disable-next-line max-params
) => ({
  name,
  section,
  subsection,
  level3,
  level4,
});

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (fn: unknown): fn is Function =>
  typeof fn === 'function';
// @ts-ignore
export const isObject = obj => typeof obj === 'object' && !Array.isArray(obj);

// @ts-ignore
export const exists = v => typeof v !== 'undefined';

export const orgIsGlobal = (org?: { id?: string }) =>
  !!org && org.id === GLOBAL_COMMUNITY_ID;

const MHUB_PERMISSIONS = [
  ORG_PERMISSIONS.OWNER,
  ORG_PERMISSIONS.ADMIN,
  ORG_PERMISSIONS.USER,
  PermissionEnum.admin,
  PermissionEnum.owner,
  PermissionEnum.user,
];

type OrgPermissionCheck =
  | {
      permission_id?: string;
      permission?: PermissionEnum;
    }
  | null
  | undefined;
export const hasOrgPermissions = (orgPermission: OrgPermissionCheck) => {
  return (
    (!!orgPermission &&
      MHUB_PERMISSIONS.includes(`${orgPermission.permission_id}`)) ||
    (!!orgPermission &&
      !!orgPermission.permission &&
      MHUB_PERMISSIONS.includes(orgPermission.permission))
  );
};

export const isAdminOrOwner = (orgPermission: OrgPermissionCheck) =>
  (!!orgPermission &&
    [ORG_PERMISSIONS.ADMIN, ORG_PERMISSIONS.OWNER].includes(
      `${orgPermission.permission_id}`,
    )) ||
  (!!orgPermission &&
    !!orgPermission.permission &&
    [PermissionEnum.admin, PermissionEnum.owner].includes(
      orgPermission.permission,
    ));

export const isOwner = (orgPermission: OrgPermissionCheck) =>
  (!!orgPermission &&
    `${orgPermission.permission_id}` === ORG_PERMISSIONS.OWNER) ||
  (!!orgPermission &&
    !!orgPermission.permission &&
    orgPermission.permission === PermissionEnum.owner);

export const isAdmin = (orgPermission: OrgPermissionCheck) =>
  (!!orgPermission &&
    `${orgPermission.permission_id}` === ORG_PERMISSIONS.ADMIN) ||
  (!!orgPermission &&
    !!orgPermission.permission &&
    orgPermission.permission === PermissionEnum.admin);

export const canEditCommunity = (permission?: PermissionEnum) =>
  permission === PermissionEnum.owner;

// @ts-ignore
export const getFirstNameAndLastInitial = (f, l) =>
  `${f || ''} ${(l || '').charAt(0)}`.trim();

// Disable the android back button
const disableBackPress = () => true;
export const disableBack = {
  add: () =>
    BackHandler.addEventListener('hardwareBackPress', disableBackPress),
  remove: () =>
    BackHandler.removeEventListener('hardwareBackPress', disableBackPress),
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

export function getStageIndex(stages: StagesState['stages'], stageId?: string) {
  const index = (stages || []).findIndex(s => s && `${s.id}` === `${stageId}`);

  return index === -1 ? undefined : index;
}

// @ts-ignore
export function getCommunityUrl(link) {
  return link ? `${Config.COMMUNITY_URL}${link}` : '';
}

export const copyText = (string: string) => {
  Clipboard.setString(string);

  toast(i18n.t('copyMessage'));
};

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
      return FeedItemSubjectTypeEnum.ACCEPTED_COMMUNITY_CHALLENGE;
    case 'Step':
      return FeedItemSubjectTypeEnum.STEP;
    case 'Post':
      return mapPostTypeToFeedType(subject.postType);
    default:
      return FeedItemSubjectTypeEnum.STORY;
  }
};
export const canModifyFeedItemSubject = (
  subject?: CommunityFeedItem_subject,
) => {
  const itemType = subject && getFeedItemType(subject);
  return [
    FeedItemSubjectTypeEnum.ANNOUNCEMENT,
    FeedItemSubjectTypeEnum.HELP_REQUEST,
    FeedItemSubjectTypeEnum.PRAYER_REQUEST,
    FeedItemSubjectTypeEnum.QUESTION,
    FeedItemSubjectTypeEnum.STORY,
    FeedItemSubjectTypeEnum.THOUGHT,
    FeedItemSubjectTypeEnum.THOUGHT,
  ].includes(itemType as FeedItemSubjectTypeEnum);
};
