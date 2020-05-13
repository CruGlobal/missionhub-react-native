import React from 'react';
import { fireEvent } from 'react-native-testing-library';
// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';
import { useNavigationState } from 'react-navigation-hooks';

import { renderWithContext } from '../../../../testUtils';
import { HeaderTabBar } from '../HeaderTabBar';
import { Touchable } from '../../common';

jest.mock('react-navigation-hooks');

// @ts-ignore
NavigationActions.navigate = jest.fn(() => ({ type: 'navigate' }));

const tabs = [
  { name: 'Tab One', navigationAction: 'Screen One' },
  { name: 'Tab Two', navigationAction: 'Screen Two' },
];

describe('HeaderTabBar', () => {
  it('should render tabs', () => {
    (useNavigationState as jest.Mock).mockReturnValue({ index: 0 });
    renderWithContext(<HeaderTabBar tabs={tabs} />).snapshot();
  });

  it('should render active tab', () => {
    (useNavigationState as jest.Mock).mockReturnValue({ index: 1 });
    renderWithContext(<HeaderTabBar tabs={tabs} />).snapshot();
  });

  it('should change tabs', () => {
    (useNavigationState as jest.Mock).mockReturnValue({ index: 0 });
    const { getAllByType } = renderWithContext(<HeaderTabBar tabs={tabs} />);
    fireEvent.press(getAllByType(Touchable)[1]);
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'Screen Two',
    });
  });

  it('should not change tabs if the tab is already selected', () => {
    (useNavigationState as jest.Mock).mockReturnValue({ index: 1 });
    const { getAllByType } = renderWithContext(<HeaderTabBar tabs={tabs} />);
    fireEvent.press(getAllByType(Touchable)[1]);
    expect(NavigationActions.navigate).not.toHaveBeenCalled();
  });
});
