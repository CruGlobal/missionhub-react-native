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
export const PUSH_NOTIFICATION_SHOULD_ASK = 'app/PUSH_NOTIFICATION_SHOULD_ASK';
export const PUSH_NOTIFICATION_ASKED = 'app/PUSH_NOTIFICATION_ASKED';
export const DISABLE_WELCOME_NOTIFICATION = 'app/DISABLE_WELCOME_NOTIFICATION';
export const PEOPLE_WITH_ORG_SECTIONS = 'app/PEOPLE_WITH_ORG_SECTIONS';
export const SWIPE_REMINDER_STEPS_HOME = 'app/SWIPE_REMINDER_STEPS_HOME';
export const SWIPE_REMINDER_STEPS_CONTACT = 'app/SWIPE_REMINDER_STEPS_CONTACT';
export const SWIPE_REMINDER_STEPS_REMINDER = 'app/SWIPE_REMINDER_STEPS_REMINDER';
export const SWIPE_REMINDER_JOURNEY = 'app/SWIPE_REMINDER_JOURNEY';
export const LOAD_PERSON_DETAILS = 'app/LOAD_PERSON_DETAILS';
export const UPDATE_PERSON_ATTRIBUTES = 'app/UPDATE_PERSON_ATTRIBUTES';
export const DELETE_PERSON = 'app/DELETE_PERSON';
export const UPDATE_JOURNEY_ITEMS = 'app/UPDATE_JOURNEY_ITEMS';
export const COMPLETED_STEP_COUNT = 'app/COMPLETED_STEP_COUNT';
export const UPDATE_STAGES = 'app/UPDATE_STAGES';
export const UPDATE_ONBOARDING_PERSON = 'app/UPDATE_ONBOARDING_PERSON';
export const RESET_ONBOARDING_PERSON = 'app/RESET_ONBOARDING_PERSON';
export const FILTERED_CHALLENGES = 'app/FILTERED_CHALLENGES';
export const COMPLETE_ONBOARDING = 'app/COMPLETE_ONBOARDING';

export const STEP_NOTE = 'stepNote';

export const NAVIGATE_FORWARD = 'Navigation/NAVIGATE';
export const NAVIGATE_RESET = 'Navigation/RESET';
export const MAIN_TABS = 'nav/MAIN_TABS';
export const DRAWER_OPEN = 'DrawerOpen';
export const DRAWER_CLOSE = 'DrawerClose';
export const MAIN_MENU_DRAWER = 'nav/drawer/main';
export const CONTACT_MENU_DRAWER = 'nav/drawer/contact';
export const UPDATE_TOKEN = 'app/UPDATE_TOKEN';
export const EXPIRED_ACCESS_TOKEN = 'Expired access token';
export const INVALID_ACCESS_TOKEN = 'Invalid access token';
export const INVALID_GRANT = 'invalid_grant';
export const NETWORK_REQUEST_FAILED = 'Network request failed';

export const URL_ENCODED = 'application/x-www-form-urlencoded';
export const THE_KEY_CLIENT_ID = Config.THE_KEY_CLIENT_ID;

export const CASEY = 'casey';
export const JEAN = 'jean';

export const LINKS = {
  about: 'https://get.missionhub.com',
  help: 'http://help.missionhub.com',
  playStore: 'market://details?id=com.missionhub',
  appleStore: 'itms://itunes.apple.com/us/app/apple-store/id447869440?mt=8',
  terms: 'https://get.missionhub.com/terms-of-service/',
};

export const ANALYTICS_CONTEXT_CHANGED = 'app/ANALYTICS_CONTEXT_CHANGED';

export const ORG_PERMISSIONS = [ 1, 4 ];
export const GCM_SENDER_ID = Config.GCM_SENDER_ID;

export const ANALYTICS = {
  MCID: 'cru.mcid',
  SCREENNAME: 'cru.screenname',
  PREVIOUS_SCREENNAME: 'cru.previousscreenname',
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
export const LOGGED_IN = 'logged in';
export const NOT_LOGGED_IN = 'not logged in';

export const ACTIONS = {
  PERSON_ADDED: 'cru.personadded',
  STATUS_CHANGED: 'cru.contactstatuschanged',
  EMAIL_ENGAGED: 'cru.emailiconengaged',
  CALL_ENGAGED: 'cru.calliconengaged',
  TEXT_ENGAGED: 'cru.texticonengaged',
  SEARCH_CLICKED: 'cru.searchbuttonclicked',
  FILTER_ENGAGED: 'cru.searchfilterengaged',
  SEARCH_FILTER: 'cru.searchfilter',
  USER_ERROR: 'cru.usersigninerror',
  SYSTEM_ERROR: 'cru.systemsigninerror',
  ONBOARDING_STARTED: 'cru.onboardingstarted',
  ONBOARDING_COMPLETE: 'cru.onboardingcomplete',
  SELF_STAGE_SELECTED: 'cru.selfselectedstage',
  PERSON_STAGE_SELECTED: 'cru.personselectedstage',
  STAGE_SELECTED: 'cru.stageselected',
  STEP_DETAIL: 'cru.stepoffaithdetail',
  STEPS_ADDED: 'cru.stepoffaithadded',
  STEP_CREATED: 'cru.stepoffaithcreated',
  ALLOW: 'cru.notificationsallowed',
  NOT_NOW: 'cru.notificationsnotallowed',
  NO_REMINDERS: 'cru.notoreminders',
  STEP_PRIORITIZED: 'cru.stepprioritized',
  STEP_DEPRIORITIZED: 'cru.stepdeprioritized',
  STEP_REMOVED: 'cru.stepremoved',
  STEP_COMPLETED: 'cru.stepcompleted',
  COMMENT_ADDED: 'cru.commentadded',
  JOURNEY_EDITED: 'cru.journeyedit',
  STEP_FIELDS: {
    ID: 'Step ID',
    STAGE: 'Stage',
    TYPE: 'Challenge Type',
    SELF: 'Self Step',
    LOCALE: 'Locale',
  },
};

export const CUSTOM_STEP_TYPE = 'user created step';

export const INTERACTION_TYPES = {
  MHInteractionTypeAssignedContacts: { id: 100, requestFieldName: 'contact_count', iconName: 'peopleIcon', translationKey: 'interactionAssignedContacts' },
  MHInteractionTypeUncontacted: { id: 101, requestFieldName: 'uncontacted_count', iconName: 'spiritualConversationsIcon', translationKey: 'interactionUncontacted' },
  MHInteractionTypeNote: { id: 1, iconName: 'commentIcon', translationKey: 'interactionNote', hideReport: true, isOnAction: true, tracking: ACTIONS.COMMENT_ADDED },
  MHInteractionTypeSpiritualConversation: { id: 2, iconName: 'spiritualConversationIcon', translationKey: 'interactionSpiritualConversation', isOnAction: true, tracking: 'cru.initiatinggospelconversations' },
  MHInteractionTypeGospelPresentation: { id: 3, iconName: 'gospelIcon', translationKey: 'interactionGospel', isOnAction: true, tracking: 'cru.presentingthegospel' },
  MHInteractionTypePersonalDecision: { id: 4, iconName: 'decisionIcon', translationKey: 'interactionDecision', isOnAction: true, tracking: 'cru.newprofessingbelievers' },
  MHInteractionTypeHolySpiritConversation: { id: 5, iconName: 'spiritIcon', translationKey: 'interactionSpirit', isOnAction: true, tracking: 'cru.presentingtheholyspirit' },
  MHInteractionTypeDiscipleshipConversation: { id: 9, iconName: 'discipleshipConversationIcon', translationKey: 'interactionDiscipleshipConversation', isOnAction: true, tracking: 'cru.discipleshipconversation' },
};

export const DEFAULT_PAGE_LIMIT = 25;
