import React from 'react';
import { fireEvent } from 'react-native-testing-library';
import MockDate from 'mockdate';

import { trackActionWithoutData } from '../../../actions/analytics';
import { renderWithContext } from '../../../../testUtils';
import { CELEBRATEABLE_TYPES } from '../../../constants';

import CelebrateItem, { CelebrateItemProps, Event } from '..';

jest.mock('../../../actions/analytics');
jest.mock('../../../actions/navigation');

const myId = '123';
const subjectPerson = {
  id: '234',
  first_name: 'John',
  last_name: 'Smith',
  full_name: 'John Smith',
};

const date = '2019-08-21T12:00:00.000';
MockDate.set('2019-08-21 12:00:00', 300);

let onRefresh = jest.fn();

const trackActionResult = { type: 'tracked plain action' };

const baseEvent: Event = {
  id: '222',
  changed_attribute_value: date,
  subject_person: subjectPerson,
  subject_person_name: subjectPerson.full_name,
  celebrateable_id: '2',
  celebrateable_type: CELEBRATEABLE_TYPES.completedStep,
  organization: { id: '3' },
  object_description: 'Celebration',
};

const initialState = { auth: { person: { id: myId } } };

beforeEach(() => {
  onRefresh = jest.fn();
  (trackActionWithoutData as jest.Mock).mockReturnValue(trackActionResult);
});

describe('global community', () => {
  it('renders for global community', () => {});
});

describe('CelebrateItem', () => {
  const testEvent = (e: Event, otherProps: Partial<CelebrateItemProps>) => {
    renderWithContext(
      <CelebrateItem event={e} onRefresh={onRefresh} {...otherProps} />,
      { initialState },
    ).snapshot();
  };

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
