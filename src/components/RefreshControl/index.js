import React, { Component } from 'react';
import { RefreshControl } from 'react-native';
import PropTypes from 'prop-types';

import theme from '../../theme';

export default class MyRefreshControl extends Component {
  setNativeProps(nProps) {
    this._view.setNativeProps(nProps);
  }

  ref = c => (this._view = c);

  render() {
    const { refreshing, ...rest } = this.props;
    return (
      <RefreshControl
        ref={this.ref}
        {...rest}
        refreshing={refreshing || false}
      />
    );
  }
}

MyRefreshControl.propTypes = {
  ...RefreshControl.propTypes,
  refreshing: PropTypes.bool,
};
MyRefreshControl.defaultProps = {
  progressBackgroundColor: theme.primaryColor, // Android only
  colors: [theme.white, theme.secondaryColor], // Android only
  tintColor: theme.primaryColor, // iOS only
};
