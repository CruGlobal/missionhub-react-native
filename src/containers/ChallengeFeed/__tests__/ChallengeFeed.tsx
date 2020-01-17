import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import * as navigation from '../../../actions/navigation';
import * as challenges from '../../../actions/challenges';
import { trackActionWithoutData } from '../../../actions/analytics';
import { CHALLENGE_DETAIL_SCREEN } from '../../ChallengeDetailScreen';
import { ACTIONS } from '../../../constants';

import ChallengeFeed from '..';

jest.mock('../../../actions/challenges', () => ({
  completeChallenge: jest.fn(() => ({ type: 'complete' })),
  joinChallenge: jest.fn(() => ({ type: 'join' })),
  updateChallenge: jest.fn(() => ({ type: 'update' })),
}));

jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn(() => ({ type: 'push' })),
}));
jest.mock('../../../actions/analytics');

const myId = '123';
const organization = { id: '456' };
const store = configureStore([thunk])({
  auth: {
    person: {
      id: myId,
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
        accepted_community_challenges,
      },
    ],
  },
];

// @ts-ignore
let component;

const props = {
  loadMoreItemsCallback: jest.fn(),
  refreshCallback: jest.fn(),
};

beforeEach(() => {
  component = renderShallow(
    <ChallengeFeed
      {...props}
      // @ts-ignore
      items={challengeItems}
      organization={organization}
    />,
    store,
  );
});

describe('Challenge Feed rendering', () => {
  it('renders correctly for challenge feed', () => {
    // @ts-ignore
    expect(component).toMatchSnapshot();
  });
});

describe('item action methods', () => {
  // @ts-ignore
  let item;
  const challenge = { id: '1', accepted_community_challenges };
  beforeEach(() => {
    // @ts-ignore
    item = component.props().renderItem({ item: challenge });
  });
  it('calls handleComplete', () => {
    // @ts-ignore
    item.props.onComplete(challenge);
    expect(challenges.completeChallenge).toHaveBeenCalledWith(
      accepted_community_challenges[0],
      organization.id,
    );
  });
  it('calls handleJoin', () => {
    // @ts-ignore
    item.props.onJoin(challenge);
    expect(challenges.joinChallenge).toHaveBeenCalledWith(
      challenge,
      organization.id,
    );
  });
});

it('renders onboarding card as header', () => {
  // @ts-ignore
  const renderedItem = component.instance().renderHeader();
  expect(renderedItem).toMatchSnapshot();
});

it('renders section header', () => {
  // @ts-ignore
  const renderedItem = component
    .props()
    .renderSectionHeader({ section: { title: 'Test Title' } });
  expect(renderedItem).toMatchSnapshot();
});

it('renders item', () => {
  // @ts-ignore
  const renderedItem = component
    .props()
    .renderItem({ item: challengeItems[0].data[0] });
  expect(renderedItem).toMatchSnapshot();
});

it('calls handleOnEndReached', () => {
  // @ts-ignore
  const instance = component.instance();
  instance.setState({ isListScrolled: true });
  // @ts-ignore
  component.props().onEndReached();
  expect(props.loadMoreItemsCallback).toHaveBeenCalled();
  expect(instance.state.isListScrolled).toBe(false);
});

it('calls handleEndDrag', () => {
  // @ts-ignore
  const instance = component.instance();
  instance.setState({ isListScrolled: false });
  // @ts-ignore
  component.props().onScrollEndDrag();
  expect(instance.state.isListScrolled).toBe(true);
});

it('calls handleRefreshing', () => {
  // @ts-ignore
  component.props().onRefresh();
  expect(props.refreshCallback).toHaveBeenCalled();
});

it('calls handleSelectRow', () => {
  // @ts-ignore
  trackActionWithoutData.mockReturnValue({ type: 'track action' });

  // @ts-ignore
  const instance = component.instance();
  const challenge = { id: '1', accepted_community_challenges };
  instance.handleSelectRow(challenge);
  expect(navigation.navigatePush).toHaveBeenCalledWith(
    CHALLENGE_DETAIL_SCREEN,
    {
      challengeId: challenge.id,
      orgId: organization.id,
    },
  );
  expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.CHALLENGE_DETAIL);
});
