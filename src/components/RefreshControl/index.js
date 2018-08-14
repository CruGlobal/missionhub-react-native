import React, { Component } from 'react';
import { RefreshControl } from 'react-native';

import theme from '../../theme';

export default class MyRefreshControl extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }

  ref = c => (this._view = c);

  render() {
    return <RefreshControl ref={this.ref} {...this.props} />;
  }
}

MyRefreshControl.propTypes = { ...RefreshControl.propTypes };
MyRefreshControl.defaultProps = {
  progressBackgroundColor: theme.primaryColor, // Android only
  colors: [theme.white, theme.secondaryColor], // Android only
  tintColor: theme.primaryColor, // iOS only
};
