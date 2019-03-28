import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { CELEBRATE_DETAIL_SCREEN } from '../../CelebrateDetailScreen';

import CelebrateFeed from '..';

import { navigatePush } from '../../../actions/navigation';
import { renderShallow } from '../../../../testUtils';
import { ACCEPTED_STEP } from '../../../constants';

jest.mock('../../../actions/navigation');
jest.mock('../../../actions/celebration');

const myId = '123';
const organization = { id: '456' };
const store = configureStore([thunk])({ auth: { person: { id: myId } } });

const celebrationItems = [
  {
    date: '2018-03-01 12:00:00',
    data: [
      {
        id: '1',
        subject_person_name: 'Roge Dog',
        celebrateable_type: ACCEPTED_STEP,
        likes_count: 0,
        adjective_attribute_value: '2',
        changed_attribute_value: '2018-03-01 12:00:00',
      },
      {
        id: '2',
        subject_person_name: 'DG With me?',
        celebrateable_type: 'interaction',
        likes_count: 0,
        adjective_attribute_value: '4',
        changed_attribute_value: '2018-03-01 12:00:00',
      },
    ],
  },
  {
    date: '2018-01-01 12:00:00',
    data: [
      {
        id: '4',
        subject_person_name: 'Roge Dog',
        celebrateable_type: ACCEPTED_STEP,
        likes_count: 11,
        adjective_attribute_value: '1',
        changed_attribute_value: '2018-01-01 12:00:00',
      },
      {
        id: '3',
        subject_person_name: 'DG With me?',
        celebrateable_type: 'interaction',
        likes_count: 42,
        adjective_attribute_value: '5',
        changed_attribute_value: '2018-01-01 12:00:00',
      },
    ],
  },
];

const navigatePushResult = { type: 'navigated' };

let component;

navigatePush.mockReturnValue(dispatch => dispatch(navigatePushResult));

beforeEach(() => {
  component = renderShallow(
    <CelebrateFeed items={celebrationItems} organization={organization} />,
    store,
  );
});

describe('Member Feed rendering', () => {
  it('renders correctly for member feed', () => {
    expect(component).toMatchSnapshot();
  });
});

it('renders section header', () => {
  const renderedItem = component
    .instance()
    .renderSectionHeader({ section: { date: '2018-08-13T12:00:00.000Z' } });
  expect(renderedItem).toMatchSnapshot();
});

describe('item', () => {
  it('renders correctly', () => {
    const renderedItem = component
      .instance()
      .renderItem({ item: celebrationItems[0] });
    expect(renderedItem).toMatchSnapshot();
  });

  it('navigates to CELEBRATE_DETAIL_SCREEN on press', () => {
    const item = celebrationItems[0];

    component
      .instance()
      .renderItem({ item })
      .props.onPressItem({ ...item });

    expect(navigatePush).toHaveBeenCalledWith(CELEBRATE_DETAIL_SCREEN, {
      event: item,
    });
    expect(store.getActions()).toEqual(
      expect.arrayContaining([navigatePushResult]),
    );
  });
});

it('renderHeader match snapshot', () => {
  const header = component.instance().renderHeader();
  expect(header).toMatchSnapshot();
});
