import Config from 'react-native-config';

export const LOGOUT = 'app/LOGOUT';
export const FIRST_TIME = 'app/FIRST_TIME';
export const OPEN_URL = 'app/OPEN_URL';
export const FIRST_NAME_CHANGED = 'app/FIRST_NAME_CHANGED';
export const LAST_NAME_CHANGED = 'app/LAST_NAME_CHANGED';
export const PERSON_FIRST_NAME_CHANGED = 'app/PERSON_FIRST_NAME_CHANGED';
export const PERSON_LAST_NAME_CHANGED = 'app/PERSON_LAST_NAME_CHANGED';
export const ADD_STEP_REMINDER = 'app/ADD_STEP_REMINDER';
export const REMOVE_STEP_REMINDER = 'app/REMOVE_STEP_REMINDER';
export const TOGGLE_STEP_FOCUS = 'app/TOGGLE_STEP_FOCUS';
export const DISABLE_WELCOME_NOTIFICATION = 'app/DISABLE_WELCOME_NOTIFICATION';
export const PEOPLE_WITH_ORG_SECTIONS = 'app/PEOPLE_WITH_ORG_SECTIONS';
export const SWIPE_REMINDER_STEPS_HOME = 'app/SWIPE_REMINDER_STEPS_HOME';
export const SWIPE_REMINDER_STEPS_CONTACT = 'app/SWIPE_REMINDER_STEPS_CONTACT';
export const SWIPE_REMINDER_STEPS_REMINDER =
  'app/SWIPE_REMINDER_STEPS_REMINDER';
export const SWIPE_REMINDER_JOURNEY = 'app/SWIPE_REMINDER_JOURNEY';
export const GROUP_INVITE_INFO = 'app/GROUP_INVITE_INFO';
export const GROUP_ONBOARDING_CARD = 'app/GROUP_ONBOARDING_CARD';
export const LOAD_PERSON_DETAILS = 'app/LOAD_PERSON_DETAILS';
export const LOAD_ORGANIZATIONS = 'app/LOAD_ORGANIZATIONS';
export const UPDATE_PERSON_ATTRIBUTES = 'app/UPDATE_PERSON_ATTRIBUTES';
export const DELETE_PERSON = 'app/DELETE_PERSON';
export const REMOVE_ORGANIZATION_MEMBER = 'app/REMOVE_ORGANIZATION_MEMBER';
export const UPDATE_JOURNEY_ITEMS = 'app/UPDATE_JOURNEY_ITEMS';
export const UPDATE_PEOPLE_INTERACTION_REPORT =
  'app/UPDATE_PEOPLE_INTERACTION_REPORT';
export const GET_ORGANIZATIONS_CONTACTS_REPORT =
  'app/GET_ORGANIZATIONS_CONTACTS_REPORT';
export const COMPLETED_STEP_COUNT = 'app/COMPLETED_STEP_COUNT';
export const UPDATE_STAGES = 'app/UPDATE_STAGES';
export const UPDATE_ONBOARDING_PERSON = 'app/UPDATE_ONBOARDING_PERSON';
export const RESET_ONBOARDING_PERSON = 'app/RESET_ONBOARDING_PERSON';
export const FILTERED_CHALLENGES = 'app/FILTERED_CHALLENGES';
export const COMPLETE_ONBOARDING = 'app/COMPLETE_ONBOARDING';
export const REQUEST_NOTIFICATIONS = 'app/REQUEST_NOTIFICATIONS';
export const LOAD_HOME_NOTIFICATION_REMINDER =
  'app/LOAD_HOME_NOTIFICATION_REMINDER';
export const GET_ORGANIZATION_MEMBERS = 'app/GET_ORGANIZATION_MEMBERS';
export const GET_ORGANIZATION_PEOPLE = 'app/GET_ORGANIZATION_PEOPLE';
export const GET_ORGANIZATION_SURVEYS = 'app/GET_ORGANIZATION_SURVEYS';
export const RESET_CELEBRATION_PAGINATION = 'app/RESET_CELEBRATION_PAGINATION';
export const RESET_CHALLENGE_PAGINATION = 'app/RESET_CHALLENGE_PAGINATION';

export const STEP_NOTE = 'stepNote';
export const CREATE_STEP = 'createStep';

export const STEPS_TAB = 'StepsTab';
export const PEOPLE_TAB = 'PeopleTab';
export const IMPACT_TAB = 'ImpactTab';
export const GROUPS_TAB = 'GroupsTab';

export const NAVIGATE_FORWARD = 'Navigation/NAVIGATE';
export const NAVIGATE_RESET = 'Navigation/RESET';
export const NAVIGATE_BACK = 'Navigation/BACK';
export const NAVIGATE_POP = 'Navigation/POP';
export const MAIN_TABS = 'nav/MAIN_TABS';
export const MAIN_MENU_DRAWER = 'nav/drawer/main';
export const PERSON_MENU_DRAWER = 'nav/drawer/person';
export const UPDATE_TOKEN = 'app/UPDATE_TOKEN';

// Errors
export const EXPIRED_ACCESS_TOKEN = 'Expired access token';
export const INVALID_ACCESS_TOKEN = 'Invalid access token';
export const INVALID_GRANT = 'invalid_grant';
export const NETWORK_REQUEST_FAILED = 'Network request failed';
export const CANNOT_EDIT_FIRST_NAME =
  'You are not allowed to edit first names of other MissionHub users';
export const MFA_REQUIRED = 'mfa_required';

export const URL_ENCODED = 'application/x-www-form-urlencoded';
export const URL_FORM_DATA = 'multipart/form-data';
export const THE_KEY_CLIENT_ID = Config.THE_KEY_CLIENT_ID;

export const CASEY = 'casey';
export const JEAN = 'jean';

export const LINKS = {
  about: 'https://get.missionhub.com',
  help: 'http://help.missionhub.com',
  playStore: 'market://details?id=com.missionhub',
  appleStore: 'itms://itunes.apple.com/us/app/apple-store/id447869440?mt=8',
  terms: 'https://get.missionhub.com/terms-of-service/',
  privacy: 'https://get.missionhub.com/privacy',
};

export const ANALYTICS_CONTEXT_CHANGED = 'app/ANALYTICS_CONTEXT_CHANGED';

export const ORG_PERMISSIONS = {
  ADMIN: 1,
  USER: 4,
  CONTACT: 2,
  OWNER: 3,
};
export const GCM_SENDER_ID = Config.GCM_SENDER_ID;

export const LOGIN_TAB_CHANGED = 'analytics/LOGIN_TAB_CHANGED';
export const MAIN_TAB_CHANGED = 'analytics/MAIN_TAB_CHANGED';
export const CONTACT_TAB_CHANGED = 'analytics/CONTACT_TAB_CHANGED';
export const PERSON_VIEWED_STAGE_CHANGED =
  'analytics/PERSON_VIEWED_STAGE_CHANGED';
export const SELF_VIEWED_STAGE_CHANGED = 'analytics/SELF_VIEWED_STAGE_CHANGED';
export const ANALYTICS = {
  MCID: 'cru.mcid',
  SCREENNAME: 'cru.screenname',
  SITE_SECTION: 'cru.sitesection',
  SITE_SUBSECTION: 'cru.sitesubsection',
  SITE_SUB_SECTION_3: 'cru.subsectionlevel3',
  CONTENT_AUDIENCE_TARGET: 'cru.contentaudiencetarget',
  CONTENT_TOPIC: 'cru.contenttopic',
  LOGGED_IN_STATUS: 'cru.loggedinstatus',
  SSO_GUID: 'cru.ssoguid',
  GR_MASTER_PERSON_ID: 'cru.grmasterpersonid',
  FACEBOOK_ID: 'cru.facebookid',
  CONTENT_LANGUAGE: 'cru.contentlanguage',
};
export const ID_SCHEMA = 'iglu:org.cru/ids/jsonschema/1-0-3';
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
  ASSIGNED_TO_ME: {
    name: 'Assigned to Me',
    key: 'cru.assignedtome',
  },
};

export const CONTACT_STEPS = 'Contact Steps';

export const CUSTOM_STEP_TYPE = 'user created step';

export const INTERACTION_TYPES = {
  MHInteractionTypeAssignedContacts: {
    id: 100,
    requestFieldName: 'contact_count',
    iconName: 'peopleIcon',
    translationKey: 'interactionAssignedContacts',
  },
  MHInteractionTypeUncontacted: {
    id: 101,
    requestFieldName: 'uncontacted_count',
    iconName: 'uncontactedIcon',
    translationKey: 'interactionUncontacted',
  },
  MHInteractionTypeNote: {
    id: 1,
    iconName: 'commentIcon',
    translationKey: 'interactionNote',
    hideReport: true,
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.COMMENT,
  },
  MHInteractionTypeSomethingCoolHappened: {
    id: 11,
    iconName: 'celebrateIcon',
    translationKey: 'interactionSomethingCoolHappened',
    hideReport: true,
    tracking: ACTIONS.INTERACTION.SOMETHING_COOL_HAPPENED,
  },
  MHInteractionTypeSpiritualConversation: {
    id: 2,
    iconName: 'spiritualConversationIcon',
    translationKey: 'interactionSpiritualConversation',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.SPIRITUAL_CONVERSATION,
  },
  MHInteractionTypeGospelPresentation: {
    id: 3,
    iconName: 'gospelIcon',
    translationKey: 'interactionGospel',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.GOSPEL_PRESENTATION,
  },
  MHInteractionTypePersonalDecision: {
    id: 4,
    iconName: 'decisionIcon',
    translationKey: 'interactionDecision',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.PERSONAL_DECISION,
  },
  MHInteractionTypeHolySpiritConversation: {
    id: 5,
    iconName: 'spiritIcon',
    translationKey: 'interactionSpirit',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.HOLY_SPIRIT_PRESENTATION,
  },
  MHInteractionTypeDiscipleshipConversation: {
    id: 9,
    iconName: 'discipleshipConversationIcon',
    translationKey: 'interactionDiscipleshipConversation',
    isOnAction: true,
    tracking: ACTIONS.INTERACTION.DISCIPLESHIP,
  },
};

export const DEFAULT_PAGE_LIMIT = 25;

export const CELEBRATEABLE_TYPES = {
  completedStep: 'accepted_challenge',
  completedInteraction: 'interaction',
  validInteractionTypes: [
    INTERACTION_TYPES.MHInteractionTypeDiscipleshipConversation.id,
    INTERACTION_TYPES.MHInteractionTypeHolySpiritConversation.id,
    INTERACTION_TYPES.MHInteractionTypePersonalDecision.id,
    INTERACTION_TYPES.MHInteractionTypeGospelPresentation.id,
    INTERACTION_TYPES.MHInteractionTypeSpiritualConversation.id,
    INTERACTION_TYPES.MHInteractionTypeSomethingCoolHappened.id,
  ],
  acceptedCommunityChallenge: 'accepted_community_challenge',
  challengeItemTypes: {
    accepted: 'accepted_at',
    completed: 'completed_at',
  },
};
