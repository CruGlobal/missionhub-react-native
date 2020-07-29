import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationParams,
  NavigationScreenProp,
} from 'react-navigation';
import { render } from 'react-native-testing-library';

export const createNavigationProp = (params?: NavigationParams) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let navigationProp: NavigationScreenProp<any> | undefined;

  const Navigator = createAppContainer(
    createSwitchNavigator({
      TestScreen: {
        screen: ({
          navigation,
        }: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          navigation: NavigationScreenProp<any>;
        }) => {
          navigationProp = navigation;
          return null;
        },
        params,
      },
    }),
  );
  render(<Navigator />);

  if (!navigationProp) {
    throw 'Unable to get navigation screen prop';
  }

  return navigationProp;
};
