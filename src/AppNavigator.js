import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { MainRoutes } from './AppRoutes';

const AppWithNavigationState = ({ dispatch, nav }) => {
  const navigation = addNavigationHelpers({ dispatch, state: nav });
  return <MainRoutes navigation={navigation} />;
};

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);