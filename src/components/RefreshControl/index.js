import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import theme from '../../theme';

export default class MyRefreshControl extends Component {
  render() {
    return <RefreshControl {...this.props} />;
  }
}

MyRefreshControl.propTypes = { ...RefreshControl.propTypes };
MyRefreshControl.defaultProps = {
  progressBackgroundColor: theme.white, // Android only
  colors: [theme.primaryColor, theme.secondaryColor], // Android only
  tintColor: theme.white, // iOS only
};
