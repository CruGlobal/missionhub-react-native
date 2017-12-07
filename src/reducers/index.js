import {combineReducers} from 'redux';

import auth from './auth';
import nav from './nav';
import profile from './profile';
import stages from './stages';
import myStageReducer from './myStage';
import steps from './steps';
import organizations from './organizations';
import people from './people';
import notifications from './notifications';

export default combineReducers({
  auth,
  nav,
  profile,
  stages,
  myStageReducer,
  steps,
  organizations,
  people,
  notifications,
});
