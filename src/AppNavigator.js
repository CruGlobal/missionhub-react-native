import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';

import { LoginRoutes, MainRoutes, FirstTimeRoutes } from './AppRoutes';

// const AppWithNavigationState = ({ dispatch, nav }) => (
//   <AppRoutes navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );
const AppWithNavigationState = ({ dispatch, isLoggedIn, isFirstTime, nav }) => {
  const navigation = addNavigationHelpers({ dispatch, state: nav });
  if (isLoggedIn) {
    return <MainRoutes navigation={navigation} />;
  }
  if (isFirstTime) {
    return <FirstTimeRoutes navigation={navigation} />;
  }
  return <LoginRoutes navigation={navigation} />;
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ auth, nav }) => ({
  isLoggedIn: auth.isLoggedIn,
  isFirstTime: auth.isFirstTime,
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);