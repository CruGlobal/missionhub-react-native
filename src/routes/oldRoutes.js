import React, { Component } from 'react';
import {
  createBottomTabNavigator,
  createDrawerNavigator,
  createStackNavigator,
} from 'react-navigation';
import Text from 'react-native';
import i18next from 'i18next';
import connect from 'react-redux/es/connect/connect';

import { buildTrackingObj, isAndroid } from '../utils/common';
import LoginScreen, { LOGIN_SCREEN } from '../containers/LoginScreen';
import LoginOptionsScreen, {
  LOGIN_OPTIONS_SCREEN,
} from '../containers/LoginOptionsScreen';
import KeyLoginScreen, { KEY_LOGIN_SCREEN } from '../containers/KeyLoginScreen';
import MFACodeScreen, { MFA_CODE_SCREEN } from '../containers/MFACodeScreen';
import Flex from '../components/Flex';
import Icon from '../components/Icon';
import {
  GROUPS_TAB,
  IMPACT_TAB,
  MAIN_TABS,
  PEOPLE_TAB,
  STEPS_TAB,
} from '../constants';
import PeopleScreen from '../containers/PeopleScreen';
import ImpactScreen from '../containers/ImpactScreen';
import GroupsListScreen from '../containers/Groups/GroupsListScreen';
import theme from '../theme';
import SettingsMenu from '../components/SettingsMenu';
import PersonSideMenu from '../components/PersonSideMenu';
import { SEARCH_SCREEN } from '../containers/SearchPeopleScreen';
import SearchPeopleScreen from '../containers/SearchPeopleScreen';
import { SEARCH_FILTER_SCREEN } from '../containers/SearchPeopleFilterScreen';
import SearchPeopleFilterScreen from '../containers/SearchPeopleFilterScreen';
import {
  GROUP_SCREEN,
  groupScreenTabNavigator,
  USER_CREATED_GROUP_SCREEN,
  userCreatedScreenTabNavigator,
} from '../containers/Groups/GroupScreen';
import { GROUPS_SURVEY_CONTACTS } from '../containers/Groups/SurveyContacts';
import SurveyContacts from '../containers/Groups/SurveyContacts';
import { SEARCH_SURVEY_CONTACTS_FILTER_SCREEN } from '../containers/Groups/SurveyContactsFilter';
import SurveyContactsFilter from '../containers/Groups/SurveyContactsFilter';
import { SEARCH_QUESTIONS_FILTER_SCREEN } from '../containers/Groups/SurveyQuestionsFilter';
import SurveyQuestionsFilter from '../containers/Groups/SurveyQuestionsFilter';
import { SEARCH_CONTACTS_FILTER_SCREEN } from '../containers/Groups/ContactsFilter';
import ContactsFilter from '../containers/Groups/ContactsFilter';
import { UNASSIGNED_PERSON_SCREEN } from '../containers/Groups/UnassignedPersonScreen';
import UnassignedPersonScreen from '../containers/Groups/UnassignedPersonScreen';
import {
  CONTACT_PERSON_SCREEN,
  ContactPersonScreen,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IsGroupsMeCommunityPersonScreen,
  IsGroupsMemberPersonScreen,
  IsUserCreatedMemberPersonScreen,
  ME_COMMUNITY_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  MeCommunityPersonScreen,
  MEMBER_PERSON_SCREEN,
  MemberPersonScreen,
  MePersonalPersonScreen,
} from '../containers/Groups/AssignedPersonScreen';
import { ADD_CONTACT_SCREEN } from '../containers/AddContactScreen';
import AddContactScreen from '../containers/AddContactScreen';
import { NOTIFICATION_OFF_SCREEN } from '../containers/NotificationOffScreen';
import NotificationOffScreen from '../containers/NotificationOffScreen';
import { CELEBRATION_SCREEN } from '../containers/CelebrationScreen';
import CelebrationScreen from '../containers/CelebrationScreen';
import { ADD_CHALLENGE_SCREEN } from '../containers/AddChallengeScreen';
import AddChallengeScreen from '../containers/AddChallengeScreen';
import { STAGE_SCREEN } from '../containers/StageScreen';
import StageScreen from '../containers/StageScreen';
import { SEARCH_REFINE_SCREEN } from '../containers/SearchPeopleFilterRefineScreen';
import SearchPeopleFilterRefineScreen from '../containers/SearchPeopleFilterRefineScreen';
import { STATUS_SELECT_SCREEN } from '../containers/StatusSelectScreen';
import StatusSelect from '../containers/StatusSelectScreen';
import { STATUS_COMPLETE_SCREEN } from '../containers/StatusCompleteScreen';
import StatusComplete from '../containers/StatusCompleteScreen';
import { STATUS_REASON_SCREEN } from '../containers/StatusReasonScreen';
import StatusReason from '../containers/StatusReasonScreen';

import { StepsTabNavigator } from './mainTabs/stepsTab';

const buildTrackedScreen = (screen, tracking, navOptions) => {
  return {
    screen: screen,
    tracking: tracking,
    navigationOptions: navOptions,
  };
};

const buildPersonScreenRoute = screen =>
  buildTrackedScreen(
    createDrawerNavigator(
      {
        Main: { screen },
      },
      {
        contentComponent: PersonSideMenu,
        drawerPosition: 'right',
        navigationOptions: { drawerLockMode: 'locked-closed' },
        backBehavior: 'none', // We're handling it on our own
      },
    ),
    buildTrackingObj(['person']),
    { gesturesEnabled: isAndroid ? false : true },
  );

const screens = {
  [SEARCH_SCREEN]: buildTrackedScreen(
    SearchPeopleScreen,
    buildTrackingObj(['search']),
    { gesturesEnabled: true },
  ),
  [SEARCH_FILTER_SCREEN]: buildTrackedScreen(
    SearchPeopleFilterScreen,
    buildTrackingObj(['search', 'refine']),
    { gesturesEnabled: true },
  ),
  [GROUP_SCREEN]: buildTrackedScreen(
    groupScreenTabNavigator,
    buildTrackingObj(['communities', 'community']),
  ),
  [USER_CREATED_GROUP_SCREEN]: buildTrackedScreen(
    userCreatedScreenTabNavigator,
    buildTrackingObj(['communities', 'community']),
  ),
  [GROUPS_SURVEY_CONTACTS]: buildTrackedScreen(
    SurveyContacts,
    buildTrackingObj(['communities', 'community'], 'survey contacts'),
    {
      gesturesEnabled: true,
    },
  ),
  [SEARCH_SURVEY_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyContactsFilter,
    buildTrackingObj(['communities', 'community'], 'survey contacts filer'),
    { gesturesEnabled: true },
  ),
  [SEARCH_QUESTIONS_FILTER_SCREEN]: buildTrackedScreen(
    SurveyQuestionsFilter,
    buildTrackingObj(['communities', 'community'], 'questions filter'),
    {
      gesturesEnabled: true,
    },
  ),
  [SEARCH_CONTACTS_FILTER_SCREEN]: buildTrackedScreen(
    ContactsFilter,
    buildTrackingObj(['communities', 'community'], 'contacts filter'),
    {
      gesturesEnabled: true,
    },
  ),
  [UNASSIGNED_PERSON_SCREEN]: buildTrackedScreen(
    UnassignedPersonScreen,
    buildTrackingObj(['person'], 'unassigned'),
    { gesturesEnabled: true },
  ),
  [CONTACT_PERSON_SCREEN]: buildPersonScreenRoute(ContactPersonScreen),
  [IS_USER_CREATED_MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(
    IsUserCreatedMemberPersonScreen,
  ),
  [IS_GROUPS_MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(
    IsGroupsMemberPersonScreen,
  ),
  [MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(MemberPersonScreen),
  [ME_PERSONAL_PERSON_SCREEN]: buildPersonScreenRoute(MePersonalPersonScreen),
  [IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoute(
    IsGroupsMeCommunityPersonScreen,
  ),
  [ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoute(MeCommunityPersonScreen),
};
