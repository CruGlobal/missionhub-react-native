import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

import theme from '../../theme';

const MyRefreshControl = ({ refreshing, ...rest }: RefreshControlProps) => {
  return (
    <RefreshControl
      progressBackgroundColor={theme.primaryColor}
      colors={[theme.white, theme.secondaryColor]}
      tintColor={theme.primaryColor}
      {...rest}
      refreshing={refreshing || false}
    />
  );
};

export default MyRefreshControl;
