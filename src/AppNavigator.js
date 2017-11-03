import 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';

import {getJsxRoutesFromState} from './utils/nav_helper';

const AppWithNavigationState = ({ dispatch, nav }) => {
  const navigation = addNavigationHelpers({ dispatch, state: nav });
  return getJsxRoutesFromState(nav, navigation);
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);