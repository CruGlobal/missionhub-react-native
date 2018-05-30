import React from 'react';
import { Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation';
jest.mock('react-navigation', () => ({
  createMaterialTopTabNavigator: jest.fn(),
}));

import { SwipeTabMenu, generateSwipeTabMenuNavigator } from '../';
import { renderShallow, testSnapshotShallow } from '../../../../testUtils';
import * as common from '../../../utils/common';
import { navigatePush } from '../../../actions/navigation';
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

beforeEach(() => {
  navigatePush.mockClear();
});

it('should render correctly', () => {
  const component = testSnapshotShallow(
    <SwipeTabMenu tabs={tabs} navigation={{ state: { index: 0 } }} />,
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
    <SwipeTabMenu tabs={tabs} navigation={{ state: { index: 0 } }} />,
  );

  component.setState({ maxMenuItemWidth: 80, previousIndex: 1 });

  expect(component).toMatchSnapshot();
});

it('should navigate on press', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu tabs={tabs} navigation={{ state: { index: 0 } }} />,
  );

  component
    .find(TouchableWithoutFeedback)
    .last()
    .simulate('press');

  expect(navigatePush).toHaveBeenCalledWith(tabs[1].navigationAction);
});

it('should navigate on end of swipe scroll', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu tabs={tabs} navigation={{ state: { index: 0 } }} />,
  );

  component.setState({ maxMenuItemWidth: 80, previousIndex: 1 });

  component
    .find(ScrollView)
    .first()
    .simulate('momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: 80 } },
    });

  expect(navigatePush).toHaveBeenCalledWith(tabs[1].navigationAction);
});

it('should scroll on navigation state update', () => {
  common.isAndroid = true;
  const component = renderShallow(
    <SwipeTabMenu tabs={tabs} navigation={{ state: { index: 1 } }} />,
  );

  const scrollToMock = jest.fn();

  component.instance().scrollView = {
    scrollTo: scrollToMock,
  };

  component.setState({ maxMenuItemWidth: 80, previousIndex: 0 });

  expect(navigatePush).not.toHaveBeenCalled();
  expect(scrollToMock).toHaveBeenCalledWith({ x: 80, y: 0, animated: true });
});

describe('generateSwipeTabMenuNavigator', () => {
  it('should create a new navigator', () => {
    generateSwipeTabMenuNavigator(tabs, <Text>Header Component</Text>);
    expect(createMaterialTopTabNavigator).toHaveBeenCalledWith(
      {
        [tabs[0].navigationAction]: tabs[0].component,
        [tabs[1].navigationAction]: tabs[1].component,
      },
      { backBehavior: 'none', tabBarComponent: expect.any(Function) },
    );

    const TabBarComponent =
      createMaterialTopTabNavigator.mock.calls[0][1].tabBarComponent;

    testSnapshotShallow(
      <TabBarComponent navigation={{ state: { index: 0 } }} />,
    );
  });
});
