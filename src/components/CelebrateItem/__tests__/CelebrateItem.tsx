import React from 'react';
import { View } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { trackActionWithoutData } from '../../../actions/analytics';
import { renderWithContext } from '../../../../testUtils';

import CelebrateItem, { CelebrateItemProps } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const myId = '123';

const trackActionResult = { type: 'tracked plain action' };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Event = any;

const baseEvent = {
  subject_person_name: 'John Smith',
  changed_attribute_value: '2004-04-04 00:00:00 UTC',
};

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
});

describe('CelebrateItem', () => {
  const testEvent = (e: Event, otherProps: Partial<CelebrateItemProps>) => {
    renderWithContext(
      <CelebrateItem event={e} onPressItem={jest.fn()} {...otherProps} />,
      { initialState },
    ).snapshot();
  };

  it('renders event with fixed height', () =>
    testEvent(baseEvent, { fixedHeight: true }));

  it('renders event with card style', () =>
    testEvent(baseEvent, { cardStyle: { padding: 20 } }));

  it('renders event with name pressable', () =>
    testEvent(baseEvent, { namePressable: true }));
});

describe('press card', () => {
  const onPressItem = jest.fn();

  it('calls onPressItem', () => {
    const { getByTestId } = renderWithContext(
      <CelebrateItem event={baseEvent} onPressItem={onPressItem} />,
      { initialState },
    );
    fireEvent.press(getByTestId('CelebrateItemCard'));

    expect(onPressItem).toHaveBeenCalledWith(baseEvent);
  });
});

describe('clear notification button', () => {
  it('renders clear notification button', () => {
    renderWithContext(
      <CelebrateItem
        event={baseEvent}
        onPressItem={jest.fn()}
        onClearNotification={jest.fn()}
      />,
      { initialState },
    ).snapshot();
  });

  it('calls onClearNotification', () => {
    const onClearNotification = jest.fn();
    const { getByTestId } = renderWithContext(
      <CelebrateItem
        event={baseEvent}
        onPressItem={jest.fn()}
        onClearNotification={onClearNotification}
      />,
      { initialState },
    );
    fireEvent.press(getByTestId('ClearNotificationButton'));

    expect(onClearNotification).toHaveBeenCalledWith(baseEvent);
  });
});
