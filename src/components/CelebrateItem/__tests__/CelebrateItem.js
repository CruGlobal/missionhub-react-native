import React from 'react';
import configureStore from 'redux-mock-store';

import CelebrateItem from '..';

import { trackActionWithoutData } from '../../../actions/analytics';
import { testSnapshotShallow, renderShallow } from '../../../../testUtils';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const mockStore = configureStore();
let store;

const myId = '123';
const orgId = '1';

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

describe('clear notification', () => {
  const onClearNotification = jest.fn();
  const clearEvent = { ...baseEvent, organization: { id: orgId } };
  const clearProps = {
    event: clearEvent,
    myId,
    onPressItem: jest.fn(),
    onClearNotification,
  };

  it('renders with clear button', () => {
    testSnapshotShallow(<CelebrateItem {...clearProps} />, store);
  });

  it('calls onClearNotification', () => {
    renderShallow(<CelebrateItem {...clearProps} />, store)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

    expect(onClearNotification).toHaveBeenCalledWith(clearEvent);
  });
});
