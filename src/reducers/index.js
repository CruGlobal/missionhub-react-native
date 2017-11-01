import {combineReducers} from 'redux';

import auth from './auth';
import nav from './nav';
import profile from './profile';

export default combineReducers({
  auth,
  nav,
  profile,
});
