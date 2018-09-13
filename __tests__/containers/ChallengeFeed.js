import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ChallengeFeed from '../../src/containers/ChallengeFeed';
import { renderShallow } from '../../testUtils';
import { ORG_PERMISSIONS } from '../../src/constants';

jest.mock('../../src/actions/celebration');

const myId = '123';
const organization = { id: '456' };
const store = configureStore([thunk])({
  auth: {
    person: {
      id: myId,
      organizational_permissions: [
        { organization_id: '456', permission_id: ORG_PERMISSIONS.ADMIN },
      ],
    },
  },
});

const date = '2018-09-06T14:13:21Z';
const challengeItems = [
  {
    title: '',
    data: [
      {
        id: '1',
        creator_id: 'person1',
        organization_id: organization.id,
        title: 'Read "There and Back Again"',
        end_date: date,
        accepted: 5,
        completed: 3,
        days_remaining: 14,
      },
      {
        id: '2',
        creator_id: 'person2',
        organization_id: organization.id,
        title: 'Invite a neighbor over for mince pie.',
        end_date: date,
        accepted: 5,
        completed: 3,
        days_remaining: 14,
        accepted_at: date,
      },
    ],
  },
  {
    title: 'Past Challenges',
    data: [
      {
        id: '3',
        creator_id: 'person3',
        organization_id: organization.id,
        title: 'Invite Smeagol over for fresh fish',
        end_date: date,
        accepted: 5,
        completed: 0,
        days_remaining: 0,
        total_days: 7,
      },
      {
        id: '4',
        creator_id: 'person4',
        organization_id: organization.id,
        title: 'Who can wear the ring the longest.',
        end_date: date,
        accepted: 5,
        completed: 3,
        days_remaining: 0,
        total_days: 7,
        accepted_at: date,
        completed_at: date,
      },
    ],
  },
];

let component;

const props = {
  loadMoreItemsCallback: jest.fn(),
  refreshCallback: jest.fn(),
};

beforeEach(() => {
  component = renderShallow(
    <ChallengeFeed
      {...props}
      items={challengeItems}
      organization={organization}
    />,
    store,
  );
});

describe('Challenge Feed rendering', () => {
  it('renders correctly for challenge feed', () => {
    expect(component).toMatchSnapshot();
  });
});

describe('item action methods', () => {
  let item;
  beforeEach(() => {
    item = component.instance().renderItem({ item: { id: '1' } });
  });
  it('calls handleComplete', () => {
    const result = item.props.onComplete(item);
    expect(result).toBe(item);
  });
  it('calls handleJoin', () => {
    const result = item.props.onJoin(item);
    expect(result).toBe(item);
  });
  it('calls handleEdit', () => {
    const result = item.props.onEdit(item);
    expect(result).toBe(item);
  });
});

it('renders section header', () => {
  const renderedItem = component
    .instance()
    .renderSectionHeader({ section: { title: 'Test Title' } });
  expect(renderedItem).toMatchSnapshot();
});

it('renders item', () => {
  const renderedItem = component
    .instance()
    .renderItem({ item: challengeItems[0].data[0] });
  expect(renderedItem).toMatchSnapshot();
});

it('calls key extractor', () => {
  const item = challengeItems[0].data[0];
  const result = component.props().keyExtractor(item);
  expect(result).toEqual(item.id);
});

it('calls handleOnEndReached', () => {
  const instance = component.instance();
  instance.setState({ isListScrolled: true });
  component.props().onEndReached();
  expect(props.loadMoreItemsCallback).toHaveBeenCalled();
  expect(instance.state.isListScrolled).toBe(false);
});

it('calls handleEndDrag', () => {
  const instance = component.instance();
  instance.setState({ isListScrolled: false });
  component.props().onScrollEndDrag();
  expect(instance.state.isListScrolled).toBe(true);
});

it('calls handleRefreshing', () => {
  component.props().onRefresh();
  expect(props.refreshCallback).toHaveBeenCalled();
});
