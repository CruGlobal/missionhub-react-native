import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import ChallengeFeed from '../../src/containers/ChallengeFeed';
import { renderShallow } from '../../testUtils';
import { ORG_PERMISSIONS } from '../../src/constants';
import * as navigation from '../../src/actions/navigation';
import * as challenges from '../../src/actions/challenges';
import { ADD_CHALLENGE_SCREEN } from '../../src/containers/AddChallengeScreen';
import { CHALLENGE_DETAIL_SCREEN } from '../../src/containers/ChallengeDetailScreen';

jest.mock('../../src/actions/challenges', () => ({
  completeChallenge: jest.fn(() => ({ type: 'complete' })),
  joinChallenge: jest.fn(() => ({ type: 'join' })),
  updateChallenge: jest.fn(() => ({ type: 'update' })),
}));

jest.mock('../../src/actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'push' })),
}));

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

const accepted_community_challenges = [
  {
    id: 'a1',
    person: { id: myId },
  },
];
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
        accepted_count: 5,
        completed_count: 3,
        days_remaining: 14,
        accepted_community_challenges: [],
      },
      {
        id: '2',
        creator_id: 'person2',
        organization_id: organization.id,
        title: 'Invite a neighbor over for mince pie.',
        end_date: date,
        accepted_count: 5,
        completed_count: 3,
        days_remaining: 14,
        accepted_community_challenges,
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
        accepted_count: 5,
        completed_count: 0,
        days_remaining: 0,
        total_days: 7,
        accepted_community_challenges,
      },
      {
        id: '4',
        creator_id: 'person4',
        organization_id: organization.id,
        title: 'Who can wear the ring the longest.',
        end_date: date,
        accepted_count: 5,
        completed_count: 3,
        days_remaining: 0,
        total_days: 7,
        accepted_community_challenges,
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
  jest.clearAllMocks();
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
  const challenge = { id: '1', accepted_community_challenges };
  beforeEach(() => {
    item = component.props().renderItem({ item: challenge });
  });
  it('calls handleComplete', () => {
    item.props.onComplete(challenge);
    expect(challenges.completeChallenge).toHaveBeenCalledWith(
      accepted_community_challenges[0],
      organization.id,
    );
  });
  it('calls handleJoin', () => {
    item.props.onJoin(challenge);
    expect(challenges.joinChallenge).toHaveBeenCalledWith(
      challenge,
      organization.id,
    );
  });
  it('calls handleEdit', () => {
    const challenge = { id: '1', end_date: date };
    item.props.onEdit(challenge);

    expect(navigation.navigatePush).toHaveBeenCalledWith(ADD_CHALLENGE_SCREEN, {
      isEdit: true,
      challenge,
      onComplete: expect.any(Function),
    });
  });
});

it('renders section header', () => {
  const renderedItem = component
    .props()
    .renderSectionHeader({ section: { title: 'Test Title' } });
  expect(renderedItem).toMatchSnapshot();
});

it('renders item', () => {
  const renderedItem = component
    .props()
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

it('calls editChallenge', () => {
  const instance = component.instance();
  const challenge = { id: '1' };
  instance.editChallenge(challenge);
  expect(challenges.updateChallenge).toHaveBeenCalledWith(
    challenge,
    organization.id,
  );
});

it('calls handleSelectRow', () => {
  const instance = component.instance();
  const challenge = { id: '1', accepted_community_challenges };
  instance.handleSelectRow(challenge);
  expect(navigation.navigatePush).toHaveBeenCalledWith(
    CHALLENGE_DETAIL_SCREEN,
    {
      challenge,
      canEditChallenges: true,
      acceptedChallenge: accepted_community_challenges[0],
      onJoin: instance.handleJoin,
      onComplete: instance.handleComplete,
      onEdit: instance.handleEdit,
    },
  );
});
