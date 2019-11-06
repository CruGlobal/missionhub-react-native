import React from 'react';
import { Text, ScrollView } from 'react-native';
// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { Touchable } from '../../../../src/components/common';
import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import * as common from '../../../utils/common';

import { SwipeTabMenu, generateSwipeTabMenuNavigator } from '..';

jest.mock('react-navigation', () => ({
  NavigationActions: { navigate: jest.fn(() => ({ type: 'navigated' })) },
}));
jest.mock('react-navigation-tabs', () => ({
  createMaterialTopTabNavigator: jest.fn(),
}));

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'test' })),
}));

const tabs = [
  {
    name: 'Tab 1',
    navigationAction: 'nav/TAB_1',
    component: () => <Text>Tab 1</Text>,
  },
  {
    name: 'Tab 2',
    navigationAction: 'nav/TAB_2',
    component: () => <Text>Tab 2</Text>,
  },
];

it('should render correctly', () => {
  const component = testSnapshotShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 0, params: {} } }}
    />,
  );

  // Render update from manual onLayout callback with new rendered element size
  component
    .instance()
    .onLayoutMenuItem({ nativeEvent: { layout: { width: 80 } } });
  component.update();

  expect(component).toMatchSnapshot();
});

it('should render light version correctly', () => {
  const component = testSnapshotShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 0, params: {} } }}
      isLight={true}
    />,
  );

  // Render update from manual onLayout callback with new rendered element size
  component
    .instance()
    .onLayoutMenuItem({ nativeEvent: { layout: { width: 80 } } });
  component.update();

  expect(component).toMatchSnapshot();
});

it('should render second tab based off of previousIndex', () => {
  // Navigation state may have just been changed to 0 but we should render with an offset since we will be transitioning from tab 1
  const component = renderShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 0, params: {} } }}
    />,
  );

  component.setState({ maxMenuItemWidth: 80, previousIndex: 1 });

  expect(component).toMatchSnapshot();
});

it('should navigate on press', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 0, params: {} } }}
    />,
  );

  component
    .find(Touchable)
    .last()
    .props()
    .onPress(1);

  expect(NavigationActions.navigate).toHaveBeenCalledWith({
    routeName: tabs[1].navigationAction,
    params: {},
  });
});

it('should navigate on end of swipe scroll', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 0, params: {} } }}
    />,
  );

  component.setState({ maxMenuItemWidth: 80, previousIndex: 1 });

  component
    .find(ScrollView)
    .first()
    .simulate('momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 80 } },
    });

  expect(NavigationActions.navigate).toHaveBeenCalledWith({
    routeName: tabs[1].navigationAction,
    params: {},
  });
});

it('should not navigate when tab not found on end of swipe scroll', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 0, params: {} } }}
    />,
  );

  component.setState({ maxMenuItemWidth: 80, previousIndex: 1 });

  component
    .find(ScrollView)
    .first()
    .simulate('momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: -10 } },
    });

  expect(NavigationActions.navigate).not.toHaveBeenCalled();
});

it('should scroll on navigation state update', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu
      tabs={tabs}
      navigation={{ state: { index: 1, params: {} } }}
    />,
  );

  const scrollToMock = jest.fn();

  component.instance().scrollView = {
    scrollTo: scrollToMock,
  };

  component.setState({ maxMenuItemWidth: 80, previousIndex: 0 });

  expect(NavigationActions.navigate).not.toHaveBeenCalled();
  expect(scrollToMock).toHaveBeenCalledWith({ x: 80, y: 0, animated: true });
});

describe('componentDidMount', () => {
  it('should do nothing if initialTab is undefined', () => {
    renderShallow(
      <SwipeTabMenu
        tabs={tabs}
        navigation={{ state: { index: 0, params: { initialTab: undefined } } }}
      />,
    );

    expect(NavigationActions.navigate).not.toHaveBeenCalled();
  });

  it('should do nothing if specified initialTab is not found', () => {
    renderShallow(
      <SwipeTabMenu
        tabs={tabs}
        navigation={{ state: { index: 0, params: { initialTab: 'some tab' } } }}
      />,
    );

    expect(NavigationActions.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to specified initialTab if found', () => {
    const initialTab = tabs[1].navigationAction;

    renderShallow(
      <SwipeTabMenu
        tabs={tabs}
        navigation={{
          state: { index: 0, params: { initialTab } },
        }}
      />,
    );

    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: initialTab,
      params: {},
    });
  });
});

describe('generateSwipeTabMenuNavigator', () => {
  it('should create a new navigator', () => {
    generateSwipeTabMenuNavigator(tabs, <Text>Header Component</Text>);
    expect(createMaterialTopTabNavigator).toHaveBeenCalledWith(
      {
        [tabs[0].navigationAction]: tabs[0].component,
        [tabs[1].navigationAction]: tabs[1].component,
      },
      {
        backBehavior: 'none',
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: expect.any(Function),
      },
    );

    const TabBarComponent =
      createMaterialTopTabNavigator.mock.calls[0][1].tabBarComponent;

    testSnapshotShallow(
      <TabBarComponent navigation={{ state: { index: 0, params: {} } }} />,
    );
  });
});
