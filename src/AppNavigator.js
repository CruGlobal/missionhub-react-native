import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';

import { LoginRoutes, MainRoutes } from './AppRoutes';

// const AppWithNavigationState = ({ dispatch, nav }) => (
//   <AppRoutes navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );
const AppWithNavigationState = ({ dispatch, isLoggedIn, nav }) => {
  const navigation = addNavigationHelpers({ dispatch, state: nav });
  if (isLoggedIn) {
    return <MainRoutes navigation={navigation} />;
  }
  return <LoginRoutes navigation={navigation} />;
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, nav }) => ({
  isLoggedIn: auth.isLoggedIn,
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);