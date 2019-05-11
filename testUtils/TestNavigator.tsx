import React, { Children } from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationComponent,
  NavigationParams,
} from 'react-navigation';

export const TestNavigator = ({
  children,
  params,
}: {
  children: NavigationComponent;
  params?: NavigationParams;
}) => {
  const Navigator = createAppContainer(
    createSwitchNavigator({
      TestScreen: { screen: () => Children.only(children), params },
    }),
  );
  return <Navigator />;
};
