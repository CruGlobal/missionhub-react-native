import { combineReducers } from 'redux';

import auth from './auth';
import nav from './nav';
import profile from './profile';
import personProfile from './personProfile';
import screenFlow from './screenFlow';
import stages from './stages';
import steps from './steps';
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
import tabs from './tabs';

export default combineReducers({
  analytics,
  auth,
  drawer,
  groups,
  impact,
  journey,
  labels,
  tabs,
  nav,
  notifications,
  organizations,
  people,
  personProfile,
  profile,
  screenFlow,
  stages,
  steps,
  surveys,
  swipe,
});
