import {combineReducers} from 'redux';

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

export default combineReducers({
  auth,
  nav,
  profile,
  personProfile,
  stages,
  myStageReducer, //TODO rename
  steps,
  organizations,
  people,
  notifications,
  impact,
});
