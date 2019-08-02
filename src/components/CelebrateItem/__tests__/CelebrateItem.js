import React from 'react';
import configureStore from 'redux-mock-store';

import { trackActionWithoutData } from '../../../actions/analytics';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

import CelebrateItem from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const mockStore = configureStore();
let store;

const myId = '123';

const trackActionResult = { type: 'tracked plain action' };

const baseEvent = {
  subject_person_name: 'John Smith',
  changed_attribute_value: '2004-04-04 00:00:00 UTC',
};

beforeEach(() => {
  store = mockStore({ auth: { person: { id: myId } } });

  trackActionWithoutData.mockReturnValue(trackActionResult);
});

describe('CelebrateItem', () => {
  const testEvent = (e, otherProps) => {
    testSnapshotShallow(
      <CelebrateItem event={e} onPressItem={jest.fn()} {...otherProps} />,
      store,
    );
  };

  it('renders event with fixed height', () =>
    testEvent(baseEvent, { fixedHeight: true }));
});

describe('press card', () => {
  const onPressItem = jest.fn();

  it('calls onPressItem', () => {
    renderShallow(
      <CelebrateItem event={baseEvent} onPressItem={onPressItem} />,
      store,
    )
      .props()
      .onPress();

    expect(onPressItem).toHaveBeenCalledWith(baseEvent);
  });
});

describe('clear notification button', () => {
  it('renders clear notification button', () => {
    testSnapshotShallow(
      <CelebrateItem
        event={baseEvent}
        onPressItem={jest.fn()}
        onClearNotification={jest.fn()}
      />,
      store,
    );
  });

  it('calls onClearNotification', () => {
    const onClearNotification = jest.fn();
    renderShallow(
      <CelebrateItem
        event={baseEvent}
        onPressItem={jest.fn()}
        onClearNotification={onClearNotification}
      />,
      store,
    )
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(onClearNotification).toHaveBeenCalledWith(baseEvent);
  });
});
