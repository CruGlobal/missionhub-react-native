/* eslint-disable max-lines */

import React from 'react';
import {
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import LandingScreen, { LANDING_SCREEN } from './containers/LandingScreen';
import StepsScreen from './containers/StepsScreen';
import { PeopleScreen } from './containers/PeopleScreen';
import AddChallengeScreen, {
  ADD_CHALLENGE_SCREEN,
} from './containers/AddChallengeScreen';
import ChallengeDetailScreen, {
  CHALLENGE_DETAIL_SCREEN,
} from './containers/ChallengeDetailScreen';
import StepReminderScreen, {
  STEP_REMINDER_SCREEN,
} from './containers/StepReminderScreen';
import SuggestedStepDetailScreen, {
  SUGGESTED_STEP_DETAIL_SCREEN,
} from './containers/SuggestedStepDetailScreen';
import AcceptedStepDetailScreen, {
  ACCEPTED_STEP_DETAIL_SCREEN,
} from './containers/AcceptedStepDetailScreen';
import CompletedStepDetailScreen, {
  COMPLETED_STEP_DETAIL_SCREEN,
} from './containers/CompletedStepDetailScreen';
import SelectStageScreen, {
  SELECT_STAGE_SCREEN,
} from './containers/SelectStageScreen';
import AddSomeoneScreen, {
  ADD_SOMEONE_SCREEN,
} from './containers/AddSomeoneScreen';
import AddContactScreen, {
  ADD_CONTACT_SCREEN,
} from './containers/AddContactScreen';
import NotificationPrimerScreen, {
  NOTIFICATION_PRIMER_SCREEN,
} from './containers/NotificationPrimerScreen';
import CelebrationScreen, {
  CELEBRATION_SCREEN,
} from './containers/CelebrationScreen';
import NotificationOffScreen, {
  NOTIFICATION_OFF_SCREEN,
} from './containers/NotificationOffScreen';
import SideMenu from './components/SideMenu';
import theme from './theme';
import {
  MAIN_TABS,
  PEOPLE_TAB,
  STEPS_TAB,
  COMMUNITIES_TAB,
  NOTIFICATIONS_TAB,
} from './constants';
import { buildTrackingObj } from './utils/common';
import GroupsListScreen from './containers/Groups/GroupsListScreen';
import CreateGroupScreen, {
  CREATE_GROUP_SCREEN,
} from './containers/Groups/CreateGroupScreen';
import { buildTrackedScreen } from './routes/helpers';
import {
  ADD_PERSON_THEN_STEP_SCREEN_FLOW,
  ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW,
  ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW,
  EDIT_PERSON_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW,
  DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW,
  JOIN_BY_CODE_FLOW,
  JOIN_BY_CODE_ONBOARDING_FLOW,
  ADD_SOMEONE_ONBOARDING_FLOW,
  FULL_ONBOARDING_FLOW,
  GET_STARTED_ONBOARDING_FLOW,
  COMPLETE_STEP_FLOW,
  SIGN_IN_FLOW,
  SIGN_UP_FLOW,
  CREATE_COMMUNITY_UNAUTHENTICATED_FLOW,
  COMPLETE_STEP_FLOW_NAVIGATE_BACK,
  ADD_MY_STEP_FLOW,
  ADD_PERSON_STEP_FLOW,
  SELECT_MY_STAGE_FLOW,
  SELECT_PERSON_STAGE_FLOW,
  ADD_SOMEONE_STEP_FLOW,
  JOURNEY_EDIT_FLOW,
} from './routes/constants';
import {
  AddPersonThenStepScreenFlowNavigator,
  AddPersonThenPeopleScreenFlowNavigator,
  AddPersonThenCommunityMembersFlowNavigator,
} from './routes/addPerson/addPersonFlow';
import { EditPersonFlowNavigator } from './routes/editPerson/editPersonFlow';
import { JoinByCodeFlowNavigator } from './routes/groups/joinByCodeFlow';
import { JoinByCodeOnboardingFlowNavigator } from './routes/onboarding/joinByCodeOnboardingFlow';
import { GetStartedOnboardingFlowNavigator } from './routes/onboarding/getStartedOnboardingFlow';
import { FullOnboardingFlowNavigator } from './routes/onboarding/fullOnboardingFlow';
import { AddSomeoneOnboardingFlowNavigator } from './routes/onboarding/addSomeoneOnboardingFlow';
import { DeepLinkJoinCommunityAuthenticatedNavigator } from './routes/deepLink/deepLinkJoinCommunityAuthenticated';
import { DeepLinkJoinCommunityUnauthenticatedNavigator } from './routes/deepLink/deepLinkJoinCommunityUnauthenticated';
import {
  CompleteStepFlowNavigator,
  CompleteStepFlowAndNavigateBackNavigator,
} from './routes/steps/completeStepFlow';
import { JourneyEditFlowNavigator } from './routes/journey/journeyEditFlow';
import { SignInFlowNavigator } from './routes/auth/signIn';
import { SignUpFlowNavigator } from './routes/auth/signUp';
import { CreateCommunityUnauthenticatedFlowNavigator } from './routes/groups/createCommunityUnauthenticatedFlow';
import { AddMyStepFlowNavigator } from './routes/steps/addMyStepFlow';
import { AddPersonStepFlowNavigator } from './routes/steps/addPersonStepFlow';
import { SelectMyStageFlowNavigator } from './routes/stage/selectMyStageFlow';
import { SelectPersonStageFlowNavigator } from './routes/stage/selectPersonStageFlow';
import TabIcon from './components/TabIcon';
import { AddSomeoneStepFlowNavigator } from './routes/addPerson/addSomeoneStepFlow';
import {
  CreatePostScreen,
  CREATE_POST_SCREEN,
} from './containers/Groups/CreatePostScreen';
import LoadingScreen, { LOADING_SCREEN } from './containers/LoadingScreen';
import ChallengeMembers, {
  CHALLENGE_MEMBERS_SCREEN,
} from './containers/ChallengeMembers';
import { CommunitiesRoutes } from './containers/Communities/CommunitiesRoutes';
import NotificationCenterScreen from './containers/NotificationCenterScreen';
import {
  OnboardingAddPhotoScreen,
  ONBOARDING_ADD_PHOTO_SCREEN,
} from './containers/OnboardingAddPhotoScreen';
import CommunityFeedWithType, {
  COMMUNITY_FEED_WITH_TYPE_SCREEN,
} from './containers/CommunityFeedWithType';
import AddPostToStepsScreen, {
  ADD_POST_TO_STEPS_SCREEN,
} from './containers/AddPostToStepsScreen';
import { PersonTabs } from './containers/PersonScreen/PersonTabs';
import {
  VideoFullScreen,
  VIDEO_FULL_SCREEN,
} from './containers/VideoFullScreen';

// Do custom animations between pages
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
// const customAnimationFunc = () => ({
//   screenInterpolator: (sceneProps) => {
//     if (
//       sceneProps.index === 0 &&
//       sceneProps.scene.route.routeName !== 'MainNavigator' &&
//       sceneProps.scenes.length > 2
//     ) return null;
//     return CardStackStyleInterpolator.forVertical(sceneProps);
//   },
// });

const navItem = (name: string) => ({ tintColor }: { tintColor: string }) => (
  <TabIcon name={name} tintColor={tintColor} />
);

const tabs = {
  [PEOPLE_TAB]: {
    screen: PeopleScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('people'),
    },
  },
  [STEPS_TAB]: {
    screen: StepsScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('steps'),
    },
  },
  [COMMUNITIES_TAB]: {
    screen: GroupsListScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('communities'),
    },
  },
  [NOTIFICATIONS_TAB]: {
    screen: NotificationCenterScreen,
    navigationOptions: {
      // @ts-ignore
      tabBarLabel: navItem('notifications'),
    },
  },
};

const MainTabBar = createBottomTabNavigator(tabs, {
  tabBarOptions: {
    showIcon: false,
    showLabel: true,
    style: {
      backgroundColor: theme.white,
      paddingTop: 4,
    },
    activeTintColor: theme.primaryColor,
    inactiveTintColor: theme.lightGrey,
    // @ts-ignore
    indicatorStyle: { backgroundColor: 'transparent' },
    upperCaseLabel: false,
    // Android
    scrollEnabled: false,
  },
  // @ts-ignore
  swipeEnabled: false,
  animationEnabled: false,
  lazy: true,
});

const MAIN_TABS_SCREEN = createDrawerNavigator(
  {
    Main: MainTabBar,
  },
  {
    contentComponent: SideMenu,
    backBehavior: 'none', // We're handling it on our own
  },
);

const screens = {
  [SUGGESTED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    SuggestedStepDetailScreen,
    // @ts-ignore
    buildTrackingObj('mh : people : steps : add : detail', 'people', 'steps'),
  ),
  [ACCEPTED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    AcceptedStepDetailScreen,
    // @ts-ignore
    buildTrackingObj(
      'mh : people : steps : accepted : detail',
      'people',
      'steps',
    ),
  ),
  [COMPLETED_STEP_DETAIL_SCREEN]: buildTrackedScreen(
    CompletedStepDetailScreen,
    // @ts-ignore
    buildTrackingObj(
      'mh : people : steps : completed : detail',
      'people',
      'steps',
    ),
  ),
  [STEP_REMINDER_SCREEN]: buildTrackedScreen(
    StepReminderScreen,
    // @ts-ignore
    buildTrackingObj('step : detail : reminder', 'step', 'detail'),
  ),
  [ADD_SOMEONE_SCREEN]: buildTrackedScreen(
    AddSomeoneScreen,
    // @ts-ignore
    buildTrackingObj('onboarding : add person', 'onboarding', 'add person'),
  ),
  [ADD_CONTACT_SCREEN]: buildTrackedScreen(
    AddContactScreen,
    // @ts-ignore
    buildTrackingObj('people : add person', 'people', 'add person'),
  ),
  [NOTIFICATION_PRIMER_SCREEN]: buildTrackedScreen(
    NotificationPrimerScreen,
    // @ts-ignore
    buildTrackingObj(
      'menu : notifications : permissions',
      'menu',
      'notifications',
    ),
  ),
  [NOTIFICATION_OFF_SCREEN]: buildTrackedScreen(
    NotificationOffScreen,
    // @ts-ignore
    buildTrackingObj('menu : notifications : off', 'menu', 'notifications'),
  ),
  [CREATE_GROUP_SCREEN]: buildTrackedScreen(
    CreateGroupScreen,
    // @ts-ignore
    buildTrackingObj('communities : create', 'communities', 'create'),
    { gesturesEnabled: true },
  ),
  [ONBOARDING_ADD_PHOTO_SCREEN]: OnboardingAddPhotoScreen,
  [MAIN_TABS]: MAIN_TABS_SCREEN,
  [SIGN_IN_FLOW]: SignInFlowNavigator,
  [SIGN_UP_FLOW]: SignUpFlowNavigator,
  [CREATE_COMMUNITY_UNAUTHENTICATED_FLOW]: CreateCommunityUnauthenticatedFlowNavigator,
  [JOIN_BY_CODE_FLOW]: JoinByCodeFlowNavigator,
  [JOIN_BY_CODE_ONBOARDING_FLOW]: JoinByCodeOnboardingFlowNavigator,
  [ADD_SOMEONE_ONBOARDING_FLOW]: AddSomeoneOnboardingFlowNavigator,
  [ADD_SOMEONE_STEP_FLOW]: AddSomeoneStepFlowNavigator,
  [FULL_ONBOARDING_FLOW]: FullOnboardingFlowNavigator,
  [GET_STARTED_ONBOARDING_FLOW]: GetStartedOnboardingFlowNavigator,
  [DEEP_LINK_JOIN_COMMUNITY_AUTHENTENTICATED_FLOW]: DeepLinkJoinCommunityAuthenticatedNavigator,
  [DEEP_LINK_JOIN_COMMUNITY_UNAUTHENTENTICATED_FLOW]: DeepLinkJoinCommunityUnauthenticatedNavigator,
  [COMPLETE_STEP_FLOW]: CompleteStepFlowNavigator,
  [CREATE_POST_SCREEN]: buildTrackedScreen(
    CreatePostScreen,
    // @ts-ignore
    buildTrackingObj(
      'communities : celebration : sharestory',
      'communities',
      'celebration',
    ),
  ),
  [COMPLETE_STEP_FLOW_NAVIGATE_BACK]: CompleteStepFlowAndNavigateBackNavigator,
  [ADD_MY_STEP_FLOW]: AddMyStepFlowNavigator,
  [ADD_PERSON_STEP_FLOW]: AddPersonStepFlowNavigator,
  [SELECT_MY_STAGE_FLOW]: SelectMyStageFlowNavigator,
  [SELECT_PERSON_STAGE_FLOW]: SelectPersonStageFlowNavigator,
  [ADD_PERSON_THEN_STEP_SCREEN_FLOW]: AddPersonThenStepScreenFlowNavigator,
  [ADD_PERSON_THEN_PEOPLE_SCREEN_FLOW]: AddPersonThenPeopleScreenFlowNavigator,
  [ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW]: AddPersonThenCommunityMembersFlowNavigator,
  [EDIT_PERSON_FLOW]: EditPersonFlowNavigator,
  [JOURNEY_EDIT_FLOW]: JourneyEditFlowNavigator,
  [LOADING_SCREEN]: LoadingScreen,
  [CHALLENGE_MEMBERS_SCREEN]: ChallengeMembers,
  [COMMUNITY_FEED_WITH_TYPE_SCREEN]: CommunityFeedWithType,
  [ADD_POST_TO_STEPS_SCREEN]: AddPostToStepsScreen,
  [VIDEO_FULL_SCREEN]: VideoFullScreen,
};

const MODAL_SCREENS = [ADD_POST_TO_STEPS_SCREEN];

const MainStackRoutes = createStackNavigator(
  {
    ...screens,
    ...CommunitiesRoutes,
    ...PersonTabs,
    [LANDING_SCREEN]: { screen: LandingScreen },
    [CELEBRATION_SCREEN]: { screen: CelebrationScreen },
    [ADD_CHALLENGE_SCREEN]: { screen: AddChallengeScreen },
    [CHALLENGE_DETAIL_SCREEN]: { screen: ChallengeDetailScreen },
    [SELECT_STAGE_SCREEN]: {
      screen: SelectStageScreen,
      // @ts-ignore
      defaultNavigationOptions: { gesturesEnabled: true },
    },
  },
  {
    initialRouteName: LANDING_SCREEN,
    defaultNavigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
    // @ts-ignore
    transitionConfig: (transitionProps, prevTransitionProps) =>
      StackViewTransitionConfigs.defaultTransitionConfig(
        transitionProps,
        prevTransitionProps,
        MODAL_SCREENS.some(
          screenName =>
            screenName === transitionProps.scene.route.routeName ||
            (prevTransitionProps &&
              screenName === prevTransitionProps.scene.route.routeName),
        ),
      ),
  },
);

export const MainRoutes = MainStackRoutes;
