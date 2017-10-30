import { combineReducers } from 'redux';

import auth from './auth';
import nav from './nav';

export default combineReducers({
  auth,
  nav,
});
