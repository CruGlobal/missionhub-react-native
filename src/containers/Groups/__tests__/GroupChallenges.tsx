import React from 'react';
import MockDate from 'mockdate';
import { fireEvent } from 'react-native-testing-library';

import GroupChallenges from '../GroupChallenges';
import { renderWithContext } from '../../../../testUtils';
import {
  getGroupChallengeFeed,
  createChallenge,
} from '../../../actions/challenges';
import { navigatePush, navigateBack } from '../../../actions/navigation';
import { ADD_CHALLENGE_SCREEN } from '../../AddChallengeScreen';
import { ORG_PERMISSIONS } from '../../../constants';
import ChallengeFeed from '../../ChallengeFeed';
import { isAdminOrOwner } from '../../../utils/common';
import { useAnalytics } from '../../../utils/hooks/useAnalytics';
import { getAnalyticsPermissionType } from '../../../utils/analytics';

jest.mock('../../../utils/hooks/useAnalytics');
jest.mock('../../../actions/challenges');
jest.mock('../../../utils/common');
jest.mock('../../../actions/navigation');
jest.mock('../../../utils/analytics');

const mockDate = '2018-09-01';
const futureDate = '2018-10-06T14:13:21Z';
const pastDate = '2018-07-06T14:13:21Z';
MockDate.set(mockDate);

const challenge1 = {
  id: '1',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Read "There and Back Again"',
  end_date: futureDate,
  accepted_count: 5,
  completed_count: 3,
};
const challenge2 = {
  id: '2',
  creator_id: 'person1',
  organization_id: '123',
  title: 'Past Challenge',
  end_date: pastDate,
  accepted_count: 5,
  completed_count: 3,
};

const challengePagination = {
  hasNextPage: true,
  page: 1,
};

const orgId = '123';
const org = {
  id: orgId,
  challengeItems: [challenge1, challenge2],
  challengePagination: challengePagination,
};

const initialState = {
  auth: {
    person: {
      organizational_permissions: [
        {
          organization_id: org.id,
          permission_id: ORG_PERMISSIONS.ADMIN,
        },
      ],
    },
  },
  organizations: {
    all: [org],
  },
  swipe: { groupOnboarding: {} },
};

beforeEach(() => {
  (getGroupChallengeFeed as jest.Mock).mockReturnValue({
    type: 'got group challenge feed',
  });

  (isAdminOrOwner as jest.Mock).mockReturnValue(false);
  (navigatePush as jest.Mock).mockReturnValue({ type: 'navigate push' });
  (navigateBack as jest.Mock).mockReturnValue({ type: 'navigated back' });
  (getAnalyticsPermissionType as jest.Mock).mockReturnValue('admin');
});

it('should render correctly', () => {
  renderWithContext(
    // @ts-ignore
    <GroupChallenges />,
    {
      navParams: { communityId: orgId },
      initialState,
    },
  ).snapshot;

  expect(useAnalytics).toHaveBeenCalledWith(['community', 'challenges'], {
    permissionType: { communityId: orgId },
  });
});

it('should render correctly for basic member', () => {
  renderWithContext(
    // @ts-ignore
    <GroupChallenges />,
    {
      navParams: { communityId: orgId },
      initialState: {
        ...initialState,
        auth: {
          person: {
            organizational_permissions: [
              {
                organization_id: org.id,
                permission_id: ORG_PERMISSIONS.USER,
              },
            ],
          },
        },
      },
    },
  ).snapshot();
});

it('should render empty correctly', () => {
  renderWithContext(
    // @ts-ignore
    <GroupChallenges />,
    {
      navParams: { communityId: orgId },
      initialState: {
        ...initialState,
        organizations: {
          all: [
            {
              ...org,
              challengeItems: [],
            },
          ],
        },
      },
    },
  ).snapshot();
});

it('should refresh items properly', () => {
  const { getByType } = renderWithContext(
    // @ts-ignore
    <GroupChallenges />,
    {
      navParams: { communityId: orgId },
      initialState,
    },
  );

  getByType(ChallengeFeed).props.refreshCallback();
});

it('should call create', async () => {
  (isAdminOrOwner as jest.Mock).mockReturnValue(true);

  const { getByTestId } = renderWithContext(<GroupChallenges />, {
    navParams: {
      communityId: orgId,
    },
    initialState,
  });
  await fireEvent.press(getByTestId('createButton'));
  const challenge = { id: '1', title: 'Test Challenge' };

  (createChallenge as jest.Mock).mockReturnValue({ type: 'create' });

  expect(navigatePush).toHaveBeenCalledWith(ADD_CHALLENGE_SCREEN, {
    onComplete: expect.any(Function),
    communityId: orgId,
  });
  (navigatePush as jest.Mock).mock.calls[0][1].onComplete(challenge);
  expect(createChallenge).toHaveBeenCalledWith(challenge, orgId);
});

it('should call API to create', () => {
  (isAdminOrOwner as jest.Mock).mockReturnValue(true);

  renderWithContext(<GroupChallenges />, {
    navParams: {
      communityId: orgId,
    },
    initialState,
  });

  (createChallenge as jest.Mock).mockReturnValue({ type: 'create' });

  const challenge = { id: '1', title: 'Test Challenge' };

  createChallenge(challenge, orgId);

  expect(createChallenge).toHaveBeenCalledWith(challenge, org.id);
});
