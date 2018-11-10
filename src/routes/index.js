import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import i18next from 'i18next';
import createSwitchNavigator from 'react-navigation/src/navigators/createSwitchNavigator';

import StepsScreen from '../containers/StepsScreen';
import PeopleScreen from '../containers/PeopleScreen';
import AddChallengeScreen, {
  ADD_CHALLENGE_SCREEN,
} from '../containers/AddChallengeScreen';
import StageScreen, { STAGE_SCREEN } from '../containers/StageScreen';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from '../containers/AddContactScreen';
import ImpactScreen from '../containers/ImpactScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from '../containers/CelebrationScreen';
import SearchPeopleScreen, {
  SEARCH_SCREEN,
} from '../containers/SearchPeopleScreen';
import SearchPeopleFilterScreen, {
  SEARCH_FILTER_SCREEN,
} from '../containers/SearchPeopleFilterScreen';
import SearchPeopleFilterRefineScreen, {
  SEARCH_REFINE_SCREEN,
} from '../containers/SearchPeopleFilterRefineScreen';
import {
  ContactPersonScreen,
  IsUserCreatedMemberPersonScreen,
  IsGroupsMemberPersonScreen,
  MemberPersonScreen,
  MePersonalPersonScreen,
  IsGroupsMeCommunityPersonScreen,
  MeCommunityPersonScreen,
  CONTACT_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  MEMBER_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  ME_COMMUNITY_PERSON_SCREEN,
  ALL_PERSON_TAB_ROUTES,
} from '../containers/Groups/AssignedPersonScreen';
import SettingsMenu from '../components/SettingsMenu';
import PersonSideMenu from '../components/PersonSideMenu';
import { Flex, Icon, Text } from '../components/common';
import theme from '../theme';
import {
  IMPACT_TAB,
  MAIN_TABS,
  PEOPLE_TAB,
  STEPS_TAB,
  GROUPS_TAB,
} from '../constants';
import { buildTrackingObj, isAndroid } from '../utils/common';
import GroupsListScreen from '../containers/Groups/GroupsListScreen';
import {
  groupScreenTabNavigator,
  userCreatedScreenTabNavigator,
  GROUP_SCREEN,
  USER_CREATED_GROUP_SCREEN,
  GROUP_TABS,
} from '../containers/Groups/GroupScreen';
import SurveyContacts, {
  GROUPS_SURVEY_CONTACTS,
} from '../containers/Groups/SurveyContacts';
import UnassignedPersonScreen, {
  UNASSIGNED_PERSON_SCREEN,
} from '../containers/Groups/UnassignedPersonScreen';
import SurveyContactsFilter, {
  SEARCH_SURVEY_CONTACTS_FILTER_SCREEN,
} from '../containers/Groups/SurveyContactsFilter';
import SurveyQuestionsFilter, {
  SEARCH_QUESTIONS_FILTER_SCREEN,
} from '../containers/Groups/SurveyQuestionsFilter';
import ContactsFilter, {
  SEARCH_CONTACTS_FILTER_SCREEN,
} from '../containers/Groups/ContactsFilter';
import StatusSelect, {
  STATUS_SELECT_SCREEN,
} from '../containers/StatusSelectScreen';
import StatusComplete, {
  STATUS_COMPLETE_SCREEN,
} from '../containers/StatusCompleteScreen';
import StatusReason, {
  STATUS_REASON_SCREEN,
} from '../containers/StatusReasonScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import NotificationOffScreen from '../containers/NotificationOffScreen';

import {
  AuthenticationNavigator,
  AuthenticationScreens,
} from './authentication';
import { OnboardingNavigator, OnboardingScreens } from './onboarding';
import { AUTHENTICATION_FLOW, ONBOARDING_FLOW } from './constants';
import { MainTabsNavigator } from './mainTabs';

export const trackableScreens = {
  [AUTHENTICATION_FLOW]: AuthenticationScreens,
  [ONBOARDING_FLOW]: OnboardingScreens,
  [MAIN_TABS]: 'something',
};

export const AppNavigator = createSwitchNavigator({
  [AUTHENTICATION_FLOW]: AuthenticationNavigator,
  [ONBOARDING_FLOW]: OnboardingNavigator,
  [MAIN_TABS]: MainTabsNavigator,
});
