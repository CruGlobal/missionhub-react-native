import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { renderWithContext } from '../../../../testUtils';
import { navToPersonScreen } from '../../../actions/person';
import { organizationSelector } from '../../../selectors/organizations';
import { acceptedChallengesSelector } from '../../../selectors/challenges';

import ChallengeMembers from '..';

jest.mock('../../../actions/person');
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
      person: { id: '111', first_name: 'Christian', last_name: 'Huffman' },
    },
  ],
  completed: [
    {
      completed_at: mockDate,
      id: '112',
      person: { id: '112', first_name: 'Scotty', last_name: 'Waggoner' },
    },
    {
      completed_at: mockDate,
      id: '113',
      person: { id: '113', first_name: 'Robert', last_name: 'Eldredge' },
    },
  ],
};

const navResponse = { type: 'nav to person screen ' };

((organizationSelector as unknown) as jest.Mock).mockReturnValue(organization);

((acceptedChallengesSelector as unknown) as jest.Mock).mockReturnValue(
  sortedAcceptedChallenges,
);

(navToPersonScreen as jest.Mock).mockReturnValue(navResponse);

it('renders correctly for joined members', () => {
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
      auth: {
        person: {
          id: '1234',
        },
      },
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
        person: { id: '111', first_name: 'Christian', last_name: 'Huffman' },
      },
      {
        accepted_at: mockDate,
        id: '112',
        person: { id: '112', first_name: 'Scotty', last_name: 'Waggoner' },
      },
    ],
  });
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
      auth: {
        person: {
          id: '1234',
        },
      },
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
      auth: {
        person: {
          id: '1234',
        },
      },
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
        person: { id: '112', first_name: 'Scotty', last_name: 'Waggoner' },
      },
    ],
  });
  renderWithContext(<ChallengeMembers />, {
    initialState: {
      organizations,
      auth: {
        person: {
          id: '1234',
        },
      },
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
      auth: {
        person: {
          id: '1234',
        },
      },
    },
    navParams: {
      challenge,
      orgId: organization.id,
      completed: false,
    },
  });

  await fireEvent.press(getByTestId('ChallengeMemberItemButton'));
  expect(navToPersonScreen).toHaveBeenCalled();
  useAnalytics(['challenge', 'detail', 'joined']);
});
