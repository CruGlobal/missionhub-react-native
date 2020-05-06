import React from 'react';
import { fireEvent } from 'react-native-testing-library';
// eslint-disable-next-line import/named
import { NavigationActions } from 'react-navigation';

import { renderWithContext } from '../../../../testUtils';
import { HeaderTabBar } from '../HeaderTabBar';
import { Touchable } from '../../common';

// @ts-ignore
NavigationActions.navigate = jest.fn(() => ({ type: 'navigate' }));

const tabs = [
  { name: 'Tab One', navigationAction: 'Screen One' },
  { name: 'Tab Two', navigationAction: 'Screen Two' },
];

describe('HeaderTabBar', () => {
  it('should render tabs', () => {
    renderWithContext(<HeaderTabBar tabs={tabs} />).snapshot();
  });

  it('should change tabs', () => {
    const { getAllByType } = renderWithContext(<HeaderTabBar tabs={tabs} />);
    fireEvent.press(getAllByType(Touchable)[1]);
    expect(NavigationActions.navigate).toHaveBeenCalledWith({
      routeName: 'Screen Two',
    });
  });
});
