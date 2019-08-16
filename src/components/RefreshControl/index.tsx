import React from 'react';
import { RefreshControlProps } from 'react-native';

import theme from '../../theme';

const RefreshControl = ({ refreshing, ...rest }: RefreshControlProps) => {
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

export default RefreshControl;
