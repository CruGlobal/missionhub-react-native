/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from 'redux';

import auth, { AuthState } from './auth';
import communityPosts, { CommunityPostsState } from './communityPosts';
import nav from './nav';
import stages, { StagesState } from './stages';
import { onboardingReducer as onboarding, OnboardingState } from './onboarding';
import organizations, { OrganizationsState } from './organizations';
import people, { PeopleState } from './people';
import notifications, { NotificationsState } from './notifications';
import impact, { ImpactState } from './impact';
import groups from './groups';
import labels from './labels';
import analytics, { AnalyticsState } from './analytics';
import swipe, { SwipeState } from './swipe';
import drawer, { DrawerState } from './drawer';
import journey from './journey';
import stepReminders, { StepReminderState } from './stepReminders';

export type RootState = {
  analytics: AnalyticsState;
  auth: AuthState;
  communityPosts: CommunityPostsState;
  drawer: DrawerState;
  groups: any; // TODO: Fill out these reducer type states
  impact: ImpactState;
  journey: any;
  labels: any;
  nav: any;
  notifications: NotificationsState;
  onboarding: OnboardingState;
  organizations: OrganizationsState;
  people: PeopleState;
  stages: StagesState;
  stepReminders: StepReminderState;
  swipe: SwipeState;
};

export default combineReducers({
  analytics,
  auth,
  communityPosts,
  drawer,
  groups,
  impact,
  journey,
  labels,
  nav,
  notifications,
  onboarding,
  organizations,
  people,
  stages,
  stepReminders,
  swipe,
});
