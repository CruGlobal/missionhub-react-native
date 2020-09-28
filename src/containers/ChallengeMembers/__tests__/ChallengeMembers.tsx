import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { renderWithContext } from '../../../../testUtils';
import { organizationSelector } from '../../../selectors/organizations';
import { acceptedChallengesSelector } from '../../../selectors/challenges';
import { navigatePush } from '../../../actions/navigation';
import { COMMUNITY_MEMBER_TABS } from '../../Communities/Community/CommunityMembers/CommunityMember/CommunityMemberTabs';
import ChallengeMembers from '..';

jest.mock('../../../actions/navigation');
jest.mock('../../../selectors/organizations');
jest.mock('../../../selectors/challenges');
jest.mock('../../../utils/hooks/useAnalytics');

const mockDate = '2020-02-26 12:00:00 PM GMT+0';
MockDate.set(mockDate);

const orgId = '1';
const challengeId = '11';

const accepted_community_challenges = [
  {
    id: '111',
    person: { id: '111' },
  },
  {
    id: '112',
    person: { id: '112' },
  },
  {
    id: '113',
    person: { id: '113' },
  },
];
const challenge = {
  id: challengeId,
  accepted_community_challenges,
  organization: { id: orgId },
};
const organization = {
  id: orgId,
  challengeItems: [challenge],
};
const organizations = {
  all: [organization],
};

const sortedAcceptedChallenges = {
  joined: [
    {
      accepted_at: mockDate,
      id: '111',
      person: {
        id: '111',
        full_name: 'Christian Huffman',
      },
    },
  ],
  completed: [
    {
      completed_at: mockDate,
      id: '112',
      person: {
        id: '112',
        full_name: 'Scotty Waggoner',
      },
    },
    {
      completed_at: mockDate,
      id: '113',
      person: {
        id: '113',
        full_name: 'Robert Eldredge',
      },
    },
  ],
};

const navigatePushResult = { type: 'navigatePush' };

((organizationSelector as unknown) as jest.Mock).mockReturnValue(organization);

((acceptedChallengesSelector as unknown) as jest.Mock).mockReturnValue(
  sortedAcceptedChallenges,
);

(navigatePush as jest.Mock).mockReturnValue(navigatePushResult);

it('renders correctly for joined members', () => {
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
    },
    navParams: {
      challenge,
      orgId: organization.id,
      completed: false,
    },
  }).snapshot();
  useAnalytics(['challenge', 'detail', 'joined']);
});

it('renders plural sentence for joined members', () => {
  ((acceptedChallengesSelector as unknown) as jest.Mock).mockReturnValue({
    ...sortedAcceptedChallenges,
    joined: [
      {
        accepted_at: mockDate,
        id: '111',
        person: {
          id: '111',
          full_name: 'Christian Huffman',
        },
      },
      {
        accepted_at: mockDate,
        id: '112',
        person: {
          id: '112',
          full_name: 'Scotty Waggoner',
        },
      },
    ],
  });
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
    },
    navParams: {
      challenge,
      orgId: organization.id,
      completed: false,
    },
  }).snapshot();
  useAnalytics(['challenge', 'detail', 'joined']);
});

it('renders correctly for completed members', () => {
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
    },
    navParams: {
      challenge,
      orgId: organization.id,
      completed: true,
    },
  }).snapshot();
  useAnalytics(['challenge', 'detail', 'completed']);
});

it('renders singular sentence for completed members', () => {
  ((acceptedChallengesSelector as unknown) as jest.Mock).mockReturnValue({
    ...sortedAcceptedChallenges,
    completed: [
      {
        completed_at: mockDate,
        id: '112',
        person: {
          id: '112',
          full_name: 'Scotty Waggoner',
        },
      },
    ],
  });
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
    },
    navParams: {
      challenge,
      orgId: organization.id,
      completed: true,
    },
  }).snapshot();
  useAnalytics(['challenge', 'detail', 'completed']);
});

it('navigates to person screen when handleSelect fires', async () => {
  const { getByTestId } = renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
    },
    navParams: {
      challenge,
      orgId: organization.id,
      completed: false,
    },
  });

  await fireEvent.press(getByTestId('ChallengeMemberItemButton'));
  expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_MEMBER_TABS, {
    personId: '111',
    communityId: organization.id,
  });
  useAnalytics(['challenge', 'detail', 'joined']);
});
