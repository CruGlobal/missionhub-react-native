/* eslint-disable max-lines */

import Config from 'react-native-config';

import { FeedItemSubjectTypeEnum } from '../__generated__/globalTypes';

export const LOGOUT = 'app/LOGOUT';
export type LogoutAction = { type: typeof LOGOUT };
export const PEOPLE_WITH_ORG_SECTIONS = 'app/PEOPLE_WITH_ORG_SECTIONS';
export const GROUP_INVITE_INFO = 'app/GROUP_INVITE_INFO';
export const GROUP_ONBOARDING_CARD = 'app/GROUP_ONBOARDING_CARD';
export const GROUP_TAB_SCROLL_ON_MOUNT = 'app/GROUP_TAB_SCROLL_ON_MOUNT';
export const LOAD_PERSON_DETAILS = 'app/LOAD_PERSON_DETAILS';
export const LOAD_ORGANIZATIONS = 'app/LOAD_ORGANIZATIONS';
export const UPDATE_PERSON_ATTRIBUTES = 'app/UPDATE_PERSON_ATTRIBUTES';
export const DELETE_PERSON = 'app/DELETE_PERSON';
export const REMOVE_ORGANIZATION_MEMBER = 'app/REMOVE_ORGANIZATION_MEMBER';
export const UPDATE_JOURNEY_ITEMS = 'app/UPDATE_JOURNEY_ITEMS';
export const GET_ORGANIZATIONS_CONTACTS_REPORT =
  'app/GET_ORGANIZATIONS_CONTACTS_REPORT';
export const RESET_STEP_COUNT = 'app/RESET_STEP_COUNT';
export const UPDATE_STAGES = 'app/UPDATE_STAGES';
export const UPDATE_CHALLENGE = 'app/UPDATE_CHALLENGE';
export const GET_ORGANIZATION_PEOPLE = 'app/GET_ORGANIZATION_PEOPLE';
export const RESET_CELEBRATION_PAGINATION = 'app/RESET_CELEBRATION_PAGINATION';
export const RESET_CHALLENGE_PAGINATION = 'app/RESET_CHALLENGE_PAGINATION';
export const RELOAD_APP = 'app/RELOAD_APP';

export const GLOBAL_COMMUNITY_ID = '_global_community_id';

export const EDIT_JOURNEY_STEP = 'editJourneyStep';
export const EDIT_JOURNEY_ITEM = 'editJourneyItem';
export const STEP_NOTE = 'stepNote';
export const CREATE_STEP = 'createStep';

export const ACCEPTED_STEP = 'accepted_challenge';

export const STEPS_TAB = 'StepsTab';
export const PEOPLE_TAB = 'PeopleTab';
export const COMMUNITIES_TAB = 'CommunitiesTab';
export const NOTIFICATIONS_TAB = 'NotificationsTab';

export const MAIN_TABS = 'nav/MAIN_TABS';
export const MAIN_MENU_DRAWER = 'nav/drawer/main';

export const SAVE_PENDING_POST = 'app/SAVE_PENDING_POST';
export const DELETE_PENDING_POST = 'app/DELETE_PENDING_POST';
export const PENDING_POST_FAILED = 'app/PENDING_POST_FAILED';
export const PENDING_POST_RETRY = 'app/PENDING_POST_RETRY';

// Errors
export const EXPIRED_ACCESS_TOKEN = 'Expired access token';
export const INVALID_ACCESS_TOKEN = 'Invalid access token';
export const INVALID_GRANT = 'invalid_grant';
export const NETWORK_REQUEST_FAILED = 'Network request failed';
export const CANNOT_EDIT_FIRST_NAME =
  'You are not allowed to edit first names of other MissionHub users';
export const ERROR_PERSON_PART_OF_ORG =
  'this person already has permissions on this organization';

export const URL_ENCODED = 'application/x-www-form-urlencoded';
export const URL_FORM_DATA = 'multipart/form-data';
export const THE_KEY_CLIENT_ID = Config.THE_KEY_CLIENT_ID;

export const LINKS = {
  blog: 'https://get.missionhub.com/blog/',
  about: 'https://get.missionhub.com',
  help: 'http://help.missionhub.com',
  shareStory: 'mailto:stories@missionhub.com',
  suggestStep: 'https://get.missionhub.com/suggest-a-step-of-faith/',
  playStore: 'market://details?id=com.missionhub',
  appleStore: 'itms://itunes.apple.com/us/app/apple-store/id447869440?mt=8',
  terms: 'https://get.missionhub.com/terms-of-service/',
  privacy: 'https://get.missionhub.com/privacy',
};

export const ORG_PERMISSIONS = {
  ADMIN: '1',
  USER: '4',
  CONTACT: '2',
  OWNER: '3',
};

//parameter names for the data we send to Analytics
export const ANALYTICS_SCREEN_NAME = 'cru_screenname';
export const ANALYTICS_SITE_SECTION = 'cru_sitesection';
export const ANALYTICS_SITE_SUBSECTION = 'cru_sitesubsection';
export const ANALYTICS_SITE_SUBSECTION_3 = 'cru_subsectionlevel3';
export const ANALYTICS_PREVIOUS_SCREEN_NAME = 'cru_previousscreenname';
export const ANALYTICS_APP_NAME = 'cru_appname';
export const ANALYTICS_LOGGED_IN_STATUS = 'cru_loggedinstatus';
export const ANALYTICS_SSO_GUID = 'cru_ssoguid';
export const ANALYTICS_GR_MASTER_PERSON_ID = 'cru_grmasterpersonid';
export const ANALYTICS_FACEBOOK_ID = 'cru_facebookid';
export const ANALYTICS_CONTENT_LANGUAGE = 'cru_contentlanguage';
export const ANALYTICS_SECTION_TYPE = 'cru_section-type';
export const ANALYTICS_ASSIGNMENT_TYPE = 'cru_assignment_type';
export const ANALYTICS_EDIT_MODE = 'cru_edit_mode';
export const ANALYTICS_PERMISSION_TYPE = 'cru_permission_type';

export const LOGGED_IN = 'logged_in';
export const NOT_LOGGED_IN = 'not_logged_in';

export const ACTIONS = {
  PERSON_ADDED: {
    name: 'person_added',
    key: 'cru_personadded',
  },
  USER_ERROR: {
    name: 'User Signin Error',
    key: 'cru.usersigninerror',
  },
  SYSTEM_ERROR: {
    name: 'System Signin Error',
    key: 'cru.systemsigninerror',
  },
  ONBOARDING_STARTED: {
    name: 'onboarding_started',
    key: 'cru_onboardingstarted',
  },
  ONBOARDING_COMPLETE: {
    name: 'onboarding_complete',
    key: 'cru_onboardingcomplete',
  },
  SELF_STAGE_SELECTED: {
    name: 'self_stage_selected',
    key: 'cru_selfselectedstage',
  },
  PERSON_STAGE_SELECTED: {
    name: 'person_stage_selected',
    key: 'cru_personselectedstage',
  },
  STAGE_SELECTED: {
    key: 'cru_stageselected',
  },
  STEP_DETAIL: {
    name: 'step_of_faith_detail',
    key: 'cru_stepoffaithdetail',
  },
  STEPS_ADDED: {
    name: 'step_of_faith_added',
    key: 'cru_stepoffaithadded',
  },
  STEP_CREATED: {
    name: 'step_of_faith_created',
    key: 'cru_stepoffaithcreated',
  },
  POST_STEP_ADDED: {
    name: 'add_to_my_steps',
    key: 'cru_addtomysteps',
  },
  STEP_POST_TYPE: {
    key: 'cru_stepposttype',
  },
  ALLOW: {
    name: 'notification_permissions_allowed',
    key: 'cru_notificationsallowed',
  },
  NOT_NOW: {
    name: 'notification_permissions_not_allowed',
    key: 'cru_notificationsnotallowed',
  },
  NO_REMINDERS: {
    name: 'notification_reminders',
    key: 'cru_notoreminders',
  },
  STEP_REMOVED: {
    name: 'step_removed',
    key: 'cru_stepremoved',
  },
  STEP_COMPLETED: {
    name: 'step_completed',
    key: 'cru_stepcompleted',
  },
  JOURNEY_EDITED: {
    name: 'edit_on_person_journey',
    key: 'cru_journeyedit',
  },
  INTERACTION: {
    name: 'action_taken_on_person',
    COMMENT: 'cru_commentadded',
  },
  ITEM_LIKED: {
    name: 'celebrate_item_liked',
    key: 'cru_celebrateitemliked',
  },
  SELECT_COMMUNITY: {
    name: 'community_selected',
    key: 'cru_selectcommunities',
  },
  SELECT_CREATED_COMMUNITY: {
    name: 'community_selected_after_create',
    key: 'cru_createcommunities',
  },
  SELECT_JOINED_COMMUNITY: {
    name: 'community_selected_after_join',
    key: 'cru_joincommunities',
  },
  SEARCH_COMMUNITY_WITH_CODE: {
    name: 'search_for_community_with_code',
    key: 'cru_codesearch',
  },
  JOIN_COMMUNITY_WITH_CODE: {
    name: 'join_community_with_code',
    key: 'cru_codejoin',
  },
  ADD_COMMUNITY_PHOTO: {
    name: 'add_photo_for_community',
    key: 'cru_communityphoto',
  },
  CREATE_COMMUNITY: {
    name: 'create_community',
    key: 'cru_communitycreate',
  },
  CHALLENGE_CREATED: {
    name: 'challenge_created',
    key: 'cru_challengecreated',
  },
  CHALLENGE_JOINED: {
    name: 'challenge_joined',
    key: 'cru_challengejoined',
  },
  CHALLENGE_COMPLETED: {
    name: 'challenge_completed',
    key: 'cru_challengecompleted',
  },
  CHALLENGE_DETAIL: {
    name: 'challenge_detail_view',
    key: 'cru_challengedetail',
  },
  MANAGE_MAKE_ADMIN: {
    name: 'make_admin',
    key: 'cru_membersmakeadmin',
  },
  MANAGE_MAKE_OWNER: {
    name: 'make_owner',
    key: 'cru_membersmakeowner',
  },
  MANAGE_REMOVE_ADMIN: {
    name: 'remove_admin',
    key: 'cru_membersremoveadmin',
  },
  MANAGE_REMOVE_MEMBER: {
    name: 'remove_member',
    key: 'cru_membersremovemember',
  },
  MANAGE_LEAVE_COMMUNITY: {
    name: 'leave_community',
    key: 'cru_membersleave',
  },
  COMMUNITY_EDIT: {
    name: 'editing_community',
    key: 'cru_communityedit',
  },
  COPY_CODE: {
    name: 'copy_community_code',
    key: 'cru_copycode',
  },
  COPY_INVITE_URL: {
    name: 'copy_community_invite_url',
    key: 'cru_copyinviteurl',
  },
  SEND_COMMUNITY_INVITE: {
    name: 'send_community_invite',
    key: 'cru_sendcommunityinvite',
  },
  NEW_CODE: {
    name: 'new_community_code',
    key: 'cru_newcode',
  },
  NEW_INVITE_URL: {
    name: 'new_community_invite_url',
    key: 'cru_newinviteurl',
  },
  COMMUNITY_DELETE: {
    name: 'delete_community',
    key: 'cru_communitydelete',
  },
  CREATE_POST: {
    name: 'create_post',
    key: 'cru_posttype',
  },
  PHOTO_ADDED: {
    name: 'add_photo_to_post',
    key: 'cru_addphototopost',
  },
  VIDEO_ADDED: {
    name: 'add_video_to_post',
    key: 'cru_addvideotopost',
  },
  POST_TYPE_SELECTED: {
    name: 'post_type_selected',
    key: 'cru_posttype',
  },
};

export const CONTACT_STEPS = 'contact_steps';

export const INTERACTION_TYPES = {
  MHInteractionTypeNote: {
    id: '1',
    iconName: 'commentIcon',
    translationKey: 'interactionNote',
    hideReport: true,
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.COMMENT,
  },
};

export const DEFAULT_PAGE_LIMIT = 25;

export const DAYS_OF_THE_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export enum NOTIFICATION_PROMPT_TYPES {
  ONBOARDING,
  FOCUS_STEP,
  LOGIN,
  SET_REMINDER,
  JOIN_COMMUNITY,
  JOIN_CHALLENGE,
}

export const DEFAULT_SUBJECT_TYPES = [
  FeedItemSubjectTypeEnum.STORY,
  FeedItemSubjectTypeEnum.QUESTION,
  FeedItemSubjectTypeEnum.PRAYER_REQUEST,
  FeedItemSubjectTypeEnum.ANNOUNCEMENT,
  FeedItemSubjectTypeEnum.HELP_REQUEST,
  FeedItemSubjectTypeEnum.THOUGHT,
  FeedItemSubjectTypeEnum.STEP,
  FeedItemSubjectTypeEnum.ACCEPTED_COMMUNITY_CHALLENGE,
  FeedItemSubjectTypeEnum.COMMUNITY_PERMISSION,
];
