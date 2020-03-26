/* eslint complexity: 0, max-lines: 0, max-params: 0 */
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { ADD_CHALLENGE_SCREEN } from '../../AddChallengeScreen';
import { renderWithContext } from '../../../../testUtils';
import { navigateBack, navigatePush } from '../../../actions/navigation';
import { AuthState } from '../../../reducers/auth';
import { OrganizationsState } from '../../../reducers/organizations';
import {
  getChallenge,
  joinChallenge,
  completeChallenge,
  updateChallenge,
} from '../../../actions/challenges';
import { communityChallengeSelector } from '../../../selectors/challenges';
import { ORG_PERMISSIONS } from '../../../constants';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';

import ChallengeDetailScreen from '..';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/challenges');
jest.mock('../../../selectors/challenges');
jest.mock('../../../selectors/people');

const myId = '1111';
const orgId = '123';
const organization = { id: orgId };

const date = '2018-09-22';
const created_at = '2018- 09-19';
const joinedChallenge = { id: 'a1', person: { id: myId } };
const completedChallenge = { ...joinedChallenge, completed_at: date };
const challengeId = '1';
const challenge = {
  id: challengeId,
  title: 'Read "There and Back Again"',
  end_date: date,
  created_at,
  isPast: false,
  accepted_community_challenges: [joinedChallenge],
};

const unjoinedProps = {
  challenge,
  orgId,
  myId,
  onComplete: jest.fn(),
  onJoin: jest.fn(),
  onEdit: jest.fn(),
  canEditChallenges: true,
  acceptedChallenge: {},
  analyticsPermissionType: 'owner',
};
const joinedProps = {
  ...unjoinedProps,
  acceptedChallenge: joinedChallenge,
};

const orgPermission = {
  organization_id: '456',
  permission_id: ORG_PERMISSIONS.ADMIN,
};

const store = {
  auth: {
    person: {
      id: myId,
      organizational_permissions: [orgPermission],
    },
  } as AuthState,
  organizations: {
    all: [organization],
  } as OrganizationsState,
};

beforeEach(() => {
  (getChallenge as jest.Mock).mockReturnValue({ type: 'got challenges' });
  (joinChallenge as jest.Mock).mockReturnValue({ type: 'join challenge' });
  (updateChallenge as jest.Mock).mockReturnValue({ type: 'update challenge' });
  (completeChallenge as jest.Mock).mockReturnValue({
    type: 'complete challenge',
  });
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigate back' });
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });

  ((communityChallengeSelector as unknown) as jest.Mock).mockReturnValue(
    challenge,
  );
});

it('should render unjoined challenge correctly', () => {
  ((communityChallengeSelector as unknown) as jest.Mock).mockReturnValue({
    ...challenge,
    accepted_community_challenges: [],
  });

  renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  }).snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should render joined challenge correctly', () => {
  const { snapshot } = renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  });
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should render completed challenge correctly', () => {
  ((communityChallengeSelector as unknown) as jest.Mock).mockReturnValue({
    ...challenge,
    accepted_community_challenges: [completedChallenge],
  });
  const { snapshot } = renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  });
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should render without edit correctly', () => {
  const { snapshot, queryByTestId } = renderWithContext(
    <ChallengeDetailScreen />,
    {
      initialState: store,
      navParams: {
        orgId,
        challengeId,
        isAdmin: false,
      },
    },
  );
  snapshot();
  expect(queryByTestId('editButton')).toBeFalsy();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
});

it('should call joinChallenge from press', async () => {
  ((communityChallengeSelector as unknown) as jest.Mock).mockReturnValue({
    ...challenge,
    accepted_community_challenges: [],
  });

  const { getByTestId } = renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  });
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
  await fireEvent.press(getByTestId('handleButton'));
  expect(joinChallenge).toHaveBeenCalledWith(
    { ...challenge, accepted_community_challenges: [] },
    orgId,
  );
});

it('should call completeChallenge from press', async () => {
  const { getByTestId } = renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  });

  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
  await fireEvent.press(getByTestId('handleButton'));
  expect(completeChallenge).toHaveBeenCalledWith(
    joinedProps.acceptedChallenge,
    orgId,
  );
});

it('should not call completeChallenge with no accepted challenge', async () => {
  ((communityChallengeSelector as unknown) as jest.Mock).mockReturnValue({
    ...challenge,
    accepted_community_challenges: [],
  });

  const { getByTestId } = renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  });

  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
  await fireEvent.press(getByTestId('handleButton'));
  expect(completeChallenge).not.toHaveBeenCalled();
});

it('should navigate to edit screen from press', async () => {
  const { getByTestId } = renderWithContext(<ChallengeDetailScreen />, {
    initialState: store,
    navParams: {
      orgId,
      challengeId,
      isAdmin: true,
    },
  });
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
  await fireEvent.press(getByTestId('editButton'));

  expect(navigatePush).toHaveBeenCalledWith(ADD_CHALLENGE_SCREEN, {
    isEdit: true,
    challenge,
    onComplete: expect.any(Function),
  });
});

it('should call navigateBack from press', async () => {
  const { snapshot, getByTestId } = renderWithContext(
    <ChallengeDetailScreen />,
    {
      initialState: store,
      navParams: {
        orgId,
        challengeId,
        isAdmin: true,
      },
    },
  );
  snapshot();
  expect(useAnalytics).toHaveBeenCalledWith(['challenge', 'detail']);
  expect(getChallenge).toHaveBeenCalledWith(challengeId);
  await fireEvent.press(getByTestId('BackButton'));
  expect(navigateBack).toHaveBeenCalled();
});
