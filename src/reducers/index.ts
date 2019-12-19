import { combineReducers } from 'redux';

import auth from './auth';
import nav from './nav';
import stages from './stages';
import steps from './steps';
import { onboardingReducer as onboarding } from './onboarding';
import organizations from './organizations';
import people from './people';
import notifications from './notifications';
import impact from './impact';
import groups from './groups';
import surveys from './surveys';
import labels from './labels';
import analytics from './analytics';
import swipe from './swipe';
import drawer from './drawer';
import journey from './journey';
import celebrateComments from './celebrateComments';
import reportedComments from './reportedComments';
import stepReminders from './stepReminders';

export default combineReducers({
  analytics,
  auth,
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
  steps,
  surveys,
  swipe,
  celebrateComments,
  reportedComments,
});
