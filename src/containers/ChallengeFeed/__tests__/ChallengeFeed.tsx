/* eslint-disable max-lines */

import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';
import MockDate from 'mockdate';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import * as challenges from '../../../actions/challenges';
import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS, ACTIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { navigatePush } from '../../../actions/navigation';
import { GROUP_ONBOARDING_TYPES } from '../../../containers/Groups/OnboardingCard';
import { trackActionWithoutData } from '../../../actions/analytics';
import { CHALLENGE_DETAIL_SCREEN } from '../../../containers/ChallengeDetailScreen';
import * as common from '../../../utils/common';
import ChallengeFeed from '..';
import { PermissionEnum } from '../../../../__generated__/globalTypes';

jest.mock('../../../selectors/people');
jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/analytics');
jest.mock('../../../actions/challenges', () => ({
  completeChallenge: jest.fn(() => ({ type: 'complete' })),
  joinChallenge: jest.fn(() => ({ type: 'join' })),
  updateChallenge: jest.fn(() => ({ type: 'update' })),
}));
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const myId = '123';
const organization = { id: '456' };
const navigatePushResult = { type: 'navigate push' };
const trackActionWithoutDataResult = { type: 'track action' };
const accepted_community_challenges = [
  {
    id: 'a1',
    person: { id: myId },
  },
];
const mockDate = '2020-03-03T14:13:21Z';
MockDate.set(mockDate);
const date = '2020-03-04T14:13:21Z';
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
        isPast: false,
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
        isPast: false,
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
        isPast: true,
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
        isPast: true,
      },
    ],
  },
];

beforeEach(() => {
  ((common as unknown) as { isAndroid: boolean }).isAndroid = false;
  (navigatePush as jest.Mock).mockReturnValue(navigatePushResult);
  (trackActionWithoutData as jest.Mock).mockReturnValue(
    trackActionWithoutDataResult,
  );
});

const props = {
  loadMoreItemsCallback: jest.fn(),
  refreshCallback: jest.fn(),
  extraPadding: false,
  refreshing: false,
};

const initialState = {
  swipe: {
    groupOnboarding: { [GROUP_ONBOARDING_TYPES.challenges]: true },
  },
};

describe('Challenge Feed rendering', () => {
  it('renders correctly for challenge feed', async () => {
    const { snapshot } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });

  it('renders correctly on android', async () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    const { snapshot } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('renders with extra padding', async () => {
    const { snapshot } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
        extraPadding={true}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });

  it('renders with extra padding on android', async () => {
    ((common as unknown) as { isAndroid: boolean }).isAndroid = true;
    const { snapshot } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
        extraPadding={true}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('renders null component | Member', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
    renderWithContext(
      <ChallengeFeed
        {...props}
        items={[{ title: '', data: [] }]}
        organization={organization}
      />,
      {
        initialState: {
          ...initialState,
          swipe: {
            groupOnboarding: { [GROUP_ONBOARDING_TYPES.challenges]: false },
          },
        },
      },
    ).snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });

  it('renders null component | Admin', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
    renderWithContext(
      <ChallengeFeed
        {...props}
        items={[{ title: '', data: [] }]}
        organization={organization}
      />,
      {
        initialState: {
          ...initialState,
          swipe: {
            groupOnboarding: { [GROUP_ONBOARDING_TYPES.challenges]: false },
          },
        },
      },
    ).snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });

  it('renders challenges without header', async () => {
    const { snapshot } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });

  it('renders null without header', () => {
    renderWithContext(
      <ChallengeFeed
        {...props}
        items={[{ title: '', data: [] }]}
        organization={organization}
      />,
      {
        initialState: {
          ...initialState,
          swipe: {
            groupOnboarding: { [GROUP_ONBOARDING_TYPES.challenges]: false },
          },
        },
      },
    ).snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });

  it('renders null with header', async () => {
    const { snapshot } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={[{ title: '', data: [] }]}
        organization={organization}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
    expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'feed']);
  });
});

describe('item action methods', () => {
  it('calls onRefresh', () => {
    const { getByTestId } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
      },
    );

    fireEvent(getByTestId('ChallengeFeed'), 'onRefresh');
    expect(props.refreshCallback).toHaveBeenCalled();
  });

  it('calls onScrollEndDrag and onEndReached', async () => {
    const { getByTestId } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
      },
    );

    await fireEvent(getByTestId('ChallengeFeed'), 'onScrollEndDrag');
    await fireEvent(getByTestId('ChallengeFeed'), 'onEndReached');
    expect(props.loadMoreItemsCallback).toHaveBeenCalled();
  });
  it('calls onRefresh', () => {
    const { getByTestId } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
      },
    );

    fireEvent(getByTestId('ChallengeFeed'), 'onRefresh');
    expect(props.refreshCallback).toHaveBeenCalled();
  });

  it('calls handleSelectRow', async () => {
    const { getAllByTestId } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
        mocks: {
          CommunityPermission: () => ({ permission: PermissionEnum.owner }),
        },
      },
    );

    await flushMicrotasksQueue();

    fireEvent(
      getAllByTestId('ChallengeItemSelectButton')[0],
      'onSelect',
      challengeItems[0].data[0],
    );

    expect(navigatePush).toHaveBeenCalledWith(CHALLENGE_DETAIL_SCREEN, {
      challengeId: challengeItems[0].data[0].id,
      isAdmin: true,
      orgId: organization.id,
    });

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.CHALLENGE_DETAIL,
    );
  });

  it('calls handleComplete', async () => {
    const accepted_community_challenges = {
      id: 'a1',
      person: { id: myId },
    };

    const { getAllByTestId } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    fireEvent(
      getAllByTestId('ChallengeItemActionButton')[0],
      'onComplete',
      challengeItems[0].data[1],
    );

    expect(challenges.completeChallenge).toHaveBeenCalledWith(
      accepted_community_challenges,
      organization.id,
    );
  });

  it('calls handleJoin', () => {
    const { getAllByTestId } = renderWithContext(
      <ChallengeFeed
        {...props}
        items={challengeItems}
        organization={organization}
      />,
      {
        initialState,
      },
    );

    fireEvent(
      getAllByTestId('ChallengeItemActionButton')[0],
      'onJoin',
      challengeItems[0].data[0],
    );
    expect(challenges.joinChallenge).toHaveBeenCalledWith(
      challengeItems[0].data[0],
      organization.id,
    );
  });
});
