import { combineReducers } from 'redux';

import auth from './auth';
import nav from './nav';
import profile from './profile';
import personProfile from './personProfile';
import stages from './stages';
import myStageReducer from './myStage';
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

export default combineReducers({
  analytics,
  auth,
  groups,
  impact,
  labels,
  myStageReducer, //TODO rename
  nav,
  notifications,
  organizations,
  people,
  personProfile,
  profile,
  stages,
  steps,
  surveys,
  swipe,
});
