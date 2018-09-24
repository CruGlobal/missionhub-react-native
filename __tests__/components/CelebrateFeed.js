import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockDate from 'mockdate';

import CelebrateFeed from '../../src/components/CelebrateFeed';
import { renderShallow } from '../../testUtils';
import { toggleLike } from '../../src/actions/celebration';

jest.mock('../../src/actions/celebration');

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
        celebrateable_type: 'accepted_challenge',
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
        celebrateable_type: 'accepted_challenge',
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

let component;

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

describe('handleToggleLike', () => {
  const toggleResult = { type: 'toggle success' };
  const eventId = '222';
  const liked = true;

  toggleLike.mockReturnValue(toggleResult);

  it('calls toggleLike', () => {
    component.instance().handleToggleLike(eventId, liked);

    expect(toggleLike).toHaveBeenCalledWith(organization.id, eventId, liked);
    expect(store.getActions()).toEqual([toggleResult]);
  });
});

it('renders section header', () => {
  const renderedItem = component
    .instance()
    .renderSectionHeader({ section: { date: MockDate.set('08/13/2018') } });
  expect(renderedItem).toMatchSnapshot();
});

it('renders item', () => {
  const renderedItem = component
    .instance()
    .renderItem({ item: celebrationItems[0] });
  expect(renderedItem).toMatchSnapshot();
});

it('calls key extractor', () => {
  const item = celebrationItems[0];
  const result = component.instance().keyExtractor(item);
  expect(result).toEqual(item.id);
});

it('renderHeader match snapshot', () => {
  const header = component.instance().renderHeader();
  expect(header).toMatchSnapshot();
});
