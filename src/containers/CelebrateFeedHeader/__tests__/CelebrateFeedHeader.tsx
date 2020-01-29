import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { getReportedComments } from '../../../actions/reportComments';
import { orgPermissionSelector } from '../../../selectors/people';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS, GLOBAL_COMMUNITY_ID } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../../Groups/GroupReport';
import { markCommentsRead } from '../../../actions/unreadComments';
import { GROUP_UNREAD_FEED_SCREEN } from '../../Groups/GroupUnreadFeed';
import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';
import { Organization } from '../../../reducers/organizations';
import { Person } from '../../../reducers/people';

import CelebrateFeedHeader from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');
jest.mock('../../../components/UnreadCommentsCard', () => 'UnreadCommentsCard');
jest.mock(
  '../../../components/ReportCommentHeaderCard',
  () => 'ReportCommentHeaderCard',
);

const comment1 = { id: 'reported1' };
const organization: Organization = {
  id: '1',
  user_created: true,
  reportedComments: [comment1],
  unread_comments_count: 12,
};
const me: Person = { id: 'myId' };

const initialState = {
  organizations: [],
  auth: {
    person: me,
  },
  reportedComments: {
    all: {
      [organization.id]: [comment1],
    },
  },
  swipe: { groupOnboarding: { [GROUP_ONBOARDING_TYPES.celebrate]: true } },
};

beforeEach(() => {
  ((organizationSelector as unknown) as jest.Mock).mockReturnValue(
    organization,
  );
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.OWNER,
  });
  (getReportedComments as jest.Mock).mockReturnValue(() => ({
    type: 'getReportedComments',
  }));
  (markCommentsRead as jest.Mock).mockReturnValue(() => ({
    type: 'markCommentsRead',
  }));
  (navigatePush as jest.Mock).mockReturnValue(() => ({ type: 'navigatePush' }));
});

describe('owner', () => {
  describe('user created community', () => {
    it('renders with 1 reported comment', () => {
      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).toHaveBeenCalledWith(organization.id);
    });
  });

  describe('cru community', () => {
    it('renders with 1 reported comment', () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });

      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).toHaveBeenCalledWith(organization.id);
    });
  });

  describe('global community', () => {
    it('renders without reported comments', () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });

      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  it('renders with 0 reported comments', () => {
    renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState: {
          ...initialState,
          reportedComments: { all: {} },
        },
      },
    ).snapshot();

    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
});

describe('admin', () => {
  beforeEach(() => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
  });

  describe('user created community', () => {
    it('renders with 1 reported comment', () => {
      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  describe('cru community', () => {
    it('renders without reported comments', () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });

      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).toHaveBeenCalledWith(organization.id);
    });
  });

  describe('global community', () => {
    it('renders without reported comments', () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });

      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  it('renders with 0 reported comments', () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      user_created: false,
    });

    renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState: {
          ...initialState,
          reportedComments: { all: {} },
        },
      },
    ).snapshot();

    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
});

describe('members', () => {
  beforeEach(() => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
  });

  describe('user created community', () => {
    it('renders without reported comments', () => {
      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  describe('cru community', () => {
    it('renders without reported comments', () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });

      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  describe('global community', () => {
    it('renders without reported comments', () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });

      renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      ).snapshot();

      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });
});

describe('unread comments card', () => {
  it('renders comment card', () => {
    renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders no comment card when global org', () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });

    renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('renders no comment card when no new comments', () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      unread_comments_count: 0,
    });

    renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState,
      },
    ).snapshot();
  });
});

it('navigates to unread comments screen', () => {
  const { getByTestId } = renderWithContext(
    <CelebrateFeedHeader isMember={false} organization={organization} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('UnreadCommentsCard'));

  expect(navigatePush).toHaveBeenCalledWith(GROUP_UNREAD_FEED_SCREEN, {
    organization,
  });
});

it('closes comment card', () => {
  const { getByTestId } = renderWithContext(
    <CelebrateFeedHeader isMember={false} organization={organization} />,
    {
      initialState,
    },
  );

  fireEvent(getByTestId('UnreadCommentsCard'), 'onClose');

  expect(markCommentsRead).toHaveBeenCalled();
});

it('navigates to group report screen', () => {
  const { getByTestId } = renderWithContext(
    <CelebrateFeedHeader isMember={false} organization={organization} />,
    {
      initialState,
    },
  );

  fireEvent.press(getByTestId('ReportCommentCard'));

  expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
    organization,
  });
});
