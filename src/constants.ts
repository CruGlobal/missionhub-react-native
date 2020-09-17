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
export const GCM_SENDER_ID = Config.GCM_SENDER_ID;

//parameter names for the data we send to Analytics
export const ANALYTICS_MCID = 'cru.mcid';
export const ANALYTICS_SCREEN_NAME = 'cru.screenname';
export const ANALYTICS_SITE_SECTION = 'cru.sitesection';
export const ANALYTICS_SITE_SUBSECTION = 'cru.sitesubsection';
export const ANALYTICS_SITE_SUBSECTION_3 = 'cru.subsectionlevel3';
export const ANALYTICS_PREVIOUS_SCREEN_NAME = 'cru.previousscreenname';
export const ANALYTICS_APP_NAME = 'cru.appname';
export const ANALYTICS_LOGGED_IN_STATUS = 'cru.loggedinstatus';
export const ANALYTICS_SSO_GUID = 'cru.ssoguid';
export const ANALYTICS_GR_MASTER_PERSON_ID = 'cru.grmasterpersonid';
export const ANALYTICS_FACEBOOK_ID = 'cru.facebookid';
export const ANALYTICS_CONTENT_LANGUAGE = 'cru.contentlanguage';
export const ANALYTICS_SECTION_TYPE = 'cru.section-type';
export const ANALYTICS_ASSIGNMENT_TYPE = 'cru.assignment-type';
export const ANALYTICS_EDIT_MODE = 'cru.edit-mode';
export const ANALYTICS_PERMISSION_TYPE = 'cru.permission-type';

export const LOGGED_IN = 'logged in';
export const NOT_LOGGED_IN = 'not logged in';

export const ACTIONS = {
  PERSON_ADDED: {
    name: 'Person Added',
    key: 'cru.personadded',
  },
  STATUS_CHANGED: {
    name: 'Contact Status Changed',
    key: 'cru.contactstatuschanged',
  },
  EMAIL_ENGAGED: {
    name: 'Contact Engaged by Email',
    key: 'cru.emailiconengaged',
  },
  CALL_ENGAGED: {
    name: 'Contact Engaged by Phone',
    key: 'cru.calliconengaged',
  },
  TEXT_ENGAGED: {
    name: 'Contact Engaged by Text',
    key: 'cru.texticonengaged',
  },
  FILTER_ENGAGED: {
    name: 'Search Filter Engaged',
    key: 'cru.searchfilterengaged',
  },
  SEARCH_FILTER: {
    key: 'cru.searchfilter',
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
    name: 'Onboarding Started',
    key: 'cru.onboardingstarted',
  },
  ONBOARDING_COMPLETE: {
    name: 'Onboarding Complete',
    key: 'cru.onboardingcomplete',
  },
  SELF_STAGE_SELECTED: {
    name: 'Self Stage Selected',
    key: 'cru.selfselectedstage',
  },
  PERSON_STAGE_SELECTED: {
    name: 'Person Stage Selected',
    key: 'cru.personselectedstage',
  },
  STAGE_SELECTED: {
    key: 'cru.stageselected',
  },
  STEP_DETAIL: {
    name: 'Step of Faith Detail',
    key: 'cru.stepoffaithdetail',
  },
  STEPS_ADDED: {
    name: 'Step of Faith Added',
    key: 'cru.stepoffaithadded',
  },
  STEP_CREATED: {
    name: 'Step of Faith Created',
    key: 'cru.stepoffaithcreated',
  },
  POST_STEP_ADDED: {
    name: 'Add to My Steps',
    key: 'cru.addtomysteps',
  },
  STEP_POST_TYPE: {
    key: 'cru.stepposttype',
  },
  ALLOW: {
    name: 'Notification Permissions',
    key: 'cru.notificationsallowed',
  },
  NOT_NOW: {
    name: 'Notification Permissions',
    key: 'cru.notificationsnotallowed',
  },
  NO_REMINDERS: {
    name: 'Notification Reminders',
    key: 'cru.notoreminders',
  },
  STEP_PRIORITIZED: {
    name: 'Step Prioritized',
    key: 'cru.stepprioritized',
  },
  STEP_DEPRIORITIZED: {
    name: 'Step Deprioritized',
    key: 'cru.stepdeprioritized',
  },
  STEP_REMOVED: {
    name: 'Step Removed',
    key: 'cru.stepremoved',
  },
  STEP_COMPLETED: {
    name: 'Step Completed',
    key: 'cru.stepcompleted',
  },
  JOURNEY_EDITED: {
    name: 'Edit on Person Journey',
    key: 'cru.journeyedit',
  },
  INTERACTION: {
    name: 'Action Taken on Person',
    COMMENT: 'cru.commentadded',
    SOMETHING_COOL_HAPPENED: 'cru.somethingcoolhappenedadded',
    SPIRITUAL_CONVERSATION: 'cru.initiatinggospelconversations',
    GOSPEL_PRESENTATION: 'cru.presentingthegospel',
    PERSONAL_DECISION: 'cru.newprofessingbelievers',
    HOLY_SPIRIT_PRESENTATION: 'cru.presentingtheholyspirit',
    DISCIPLESHIP: 'cru.discipleshipconversation',
  },
  ITEM_LIKED: {
    name: 'Celebrate Item Liked',
    key: 'cru.celebrateitemliked',
  },
  CELEBRATE_COMMENT_ADDED: {
    name: 'Celebrate Comment Added',
    key: 'cru.sendcelebratecomment',
  },
  CELEBRATE_COMMENT_EDITED: {
    name: 'Celebrate Comment Edited',
    key: 'cru.editcelebratecomment',
  },
  CELEBRATE_COMMENT_DELETED: {
    name: 'Celebrate Comment Deleted',
    key: 'cru.deletecelebratecomment',
  },
  CELEBRATE_COMMENT_REPORTED: {
    name: 'Celebrate Comment Reported',
    key: 'cru.reportcelebratecomment',
  },
  ASSIGNED_TO_ME: {
    name: 'Assigned to Me',
    key: 'cru.assignedtome',
  },
  SELECT_COMMUNITY: {
    name: 'Community Selected',
    key: 'cru.selectcommunities',
  },
  SELECT_CREATED_COMMUNITY: {
    name: 'Community Selected After Create',
    key: 'cru.createcommunities',
  },
  SELECT_JOINED_COMMUNITY: {
    name: 'Community Selected After Join',
    key: 'cru.joincommunities',
  },
  SEARCH_COMMUNITY_WITH_CODE: {
    name: 'Search for Community With Code',
    key: 'cru.codesearch',
  },
  JOIN_COMMUNITY_WITH_CODE: {
    name: 'Join Community With Code',
    key: 'cru.codejoin',
  },
  ADD_COMMUNITY_PHOTO: {
    name: 'Add Photo for Community',
    key: 'cru.communityphoto',
  },
  CREATE_COMMUNITY: {
    name: 'Create Community',
    key: 'cru.communitycreate',
  },
  CHALLENGE_CREATED: {
    name: 'Challenge Created',
    key: 'cru.challengecreated',
  },
  CHALLENGE_JOINED: {
    name: 'Challenge Joined',
    key: 'cru.challengejoined',
  },
  CHALLENGE_COMPLETED: {
    name: 'Challenge Completed',
    key: 'cru.challengecompleted',
  },
  CHALLENGE_DETAIL: {
    name: 'Challenge Detail View',
    key: 'cru.challengedetail',
  },
  MANAGE_MAKE_ADMIN: {
    name: 'Make Admin',
    key: 'cru.membersmakeadmin',
  },
  MANAGE_MAKE_OWNER: {
    name: 'Make Owner',
    key: 'cru.membersmakeowner',
  },
  MANAGE_REMOVE_ADMIN: {
    name: 'Remove Admin',
    key: 'cru.membersremoveadmin',
  },
  MANAGE_REMOVE_MEMBER: {
    name: 'Remove Member',
    key: 'cru.membersremovemember',
  },
  MANAGE_LEAVE_COMMUNITY: {
    name: 'Leave Community',
    key: 'cru.membersleave',
  },
  COMMUNITY_EDIT: {
    name: 'Editting Community',
    key: 'cru.communityedit',
  },
  COPY_CODE: {
    name: 'Copy Community Code',
    key: 'cru.copycode',
  },
  COPY_INVITE_URL: {
    name: 'Copy Community Invite URL',
    key: 'cru.copyinviteurl',
  },
  SEND_COMMUNITY_INVITE: {
    name: 'Send Community Invite',
    key: 'cru.sendcommunityinvite',
  },
  NEW_CODE: {
    name: 'New Community Code',
    key: 'cru.newcode',
  },
  NEW_INVITE_URL: {
    name: 'New Community Invite URL',
    key: 'cru.newinviteurl',
  },
  COMMUNITY_DELETE: {
    name: 'Delete Community',
    key: 'cru.communitydelete',
  },
  CREATE_POST: {
    name: 'Create Post',
    key: 'cru.posttype',
  },
  PHOTO_ADDED: {
    name: 'Add Photo to Post',
    key: 'cru.addphototopost',
  },
  VIDEO_ADDED: {
    name: 'Add Video to Post',
    key: 'cru.addvideotopost',
  },
  POST_TYPE_SELECTED: {
    name: 'Post Type Selected',
    key: 'cru.posttype',
  },
};

export const CONTACT_STEPS = 'Contact Steps';

export const INTERACTION_TYPES = {
  MHInteractionTypeAssignedContacts: {
    id: '100',
    requestFieldName: 'contact_count',
    iconName: 'peopleIcon',
    translationKey: 'interactionAssignedContacts',
  },
  MHInteractionTypeUncontacted: {
    id: '101',
    requestFieldName: 'uncontacted_count',
    iconName: 'uncontactedIcon',
    translationKey: 'interactionUncontacted',
  },
  MHInteractionTypeNote: {
    id: '1',
    iconName: 'commentIcon',
    translationKey: 'interactionNote',
    hideReport: true,
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.COMMENT,
  },
  MHInteractionTypeSomethingCoolHappened: {
    id: '11',
    iconName: 'celebrateIcon',
    translationKey: 'interactionSomethingCoolHappened',
    hideReport: true,
    tracking: ACTIONS.INTERACTION.SOMETHING_COOL_HAPPENED,
  },
  MHInteractionTypeSpiritualConversation: {
    id: '2',
    iconName: 'spiritualConversationIcon',
    translationKey: 'interactionSpiritualConversation',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.SPIRITUAL_CONVERSATION,
  },
  MHInteractionTypeGospelPresentation: {
    id: '3',
    iconName: 'gospelIcon',
    translationKey: 'interactionGospel',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.GOSPEL_PRESENTATION,
  },
  MHInteractionTypePersonalDecision: {
    id: '4',
    iconName: 'decisionIcon',
    translationKey: 'interactionDecision',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.PERSONAL_DECISION,
  },
  MHInteractionTypeHolySpiritConversation: {
    id: '5',
    iconName: 'spiritIcon',
    translationKey: 'interactionSpirit',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.HOLY_SPIRIT_PRESENTATION,
  },
  MHInteractionTypeDiscipleshipConversation: {
    id: '9',
    iconName: 'discipleshipConversationIcon',
    translationKey: 'interactionDiscipleshipConversation',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.DISCIPLESHIP,
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
