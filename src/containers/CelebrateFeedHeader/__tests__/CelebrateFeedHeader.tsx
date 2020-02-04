/* eslint-disable max-lines */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { MockList } from 'graphql-tools';
import { flushMicrotasksQueue, fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { orgPermissionSelector } from '../../../selectors/people';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS, GLOBAL_COMMUNITY_ID } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import {
  GROUPS_REPORT_SCREEN,
  GET_REPORTED_CONTENT,
} from '../../Groups/GroupReport';
import { GROUP_ONBOARDING_TYPES } from '../../Groups/OnboardingCard';
import { markCommentsRead } from '../../../actions/unreadComments';
import { GROUP_UNREAD_FEED_SCREEN } from '../../Groups/GroupUnreadFeed';
import { Organization } from '../../../reducers/organizations';

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

(markCommentsRead as jest.Mock).mockReturnValue(() => ({
  type: 'markCommentsRead',
}));
(navigatePush as jest.Mock).mockReturnValue(() => ({ type: 'navigatePush' }));

const organization: Organization = {
  id: '1',
  user_created: true,
  unread_comments_count: 12,
};

const globalCommunity = {
  user_created: false,
  id: GLOBAL_COMMUNITY_ID,
  unread_comments_count: 0,
};
const me = { id: 'myId' };

const initialState = {
  organizations: [],
  auth: {
    person: me,
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
});
// Owner
describe('owner', () => {
  describe('user created community', () => {
    it('renders with 1 reported item', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => new MockList(1),
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    });

    it('renders with multiple reported items', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    });

    it('renders with multiple reported items but no unreadComments', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        unread_comments_count: 0,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(queryByTestId('ReportCommentCard')).toBeTruthy();
      expect(queryByTestId('UnreadCommentsCard')).toBeNull();
    });
  });

  describe('cru community', () => {
    it('renders with 1 reported item', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => new MockList(1),
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    });
  });

  describe('global community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={globalCommunity} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });
  });

  it('renders with 0 reported items', async () => {
    const { snapshot, queryByTestId } = renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState: { ...initialState, reportComments: { all: {} } },
        mocks: {
          Community: () => ({
            contentComplaints: () => ({
              nodes: () => [],
            }),
          }),
        },
      },
    );
    await flushMicrotasksQueue();
    expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
      variables: { id: '1' },
    });
    snapshot();
    expect(queryByTestId('ReportCommentCard')).toBeNull();
  });
});
// Admin
describe('admin', () => {
  beforeEach(() => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
  });

  describe('user created community', () => {
    it('does not render reported item card even when there is 1 reported item', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => new MockList(1),
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });
  });

  describe('cru community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });

    it('renders with multiple reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    });
  });

  describe('global community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={globalCommunity} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });

    it('renders with 0 reported items', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={globalCommunity} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });
  });
});

// Members
describe('members', () => {
  beforeEach(() => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
  });

  describe('user created community', () => {
    it('renders without reported items', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      snapshot();
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });

    it('does not render the reported items card even when reported items exist', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      snapshot();
      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });
  });

  describe('cru community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();

      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });

      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });

    it('does not render reported item card even when reported items exist', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();

      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });

      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });
  });

  describe('global community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader isMember={false} organization={organization} />,
        {
          initialState,
          mocks: {
            Community: () => ({
              contentComplaints: () => ({
                nodes: () => [],
              }),
            }),
          },
        },
      );
      await flushMicrotasksQueue();
      snapshot();

      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: GLOBAL_COMMUNITY_ID },
      });

      expect(queryByTestId('ReportCommentCard')).toBeNull();
    });
  });
});

describe('unread comments card', () => {
  it('renders comment card', async () => {
    const { snapshot, queryByTestId } = renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
      variables: { id: '1' },
    });
    expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    expect(queryByTestId('UnreadCommentsCard')).toBeTruthy();
  });

  it('renders no comment card when global org', async () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });
    const { snapshot, queryByTestId } = renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={globalCommunity} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    expect(queryByTestId('UnreadCommentsCard')).toBeNull();
  });

  it('renders no comment card when no new comments', async () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      unread_comments_count: 0,
    });
    const { snapshot, queryByTestId } = renderWithContext(
      <CelebrateFeedHeader isMember={false} organization={organization} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
      variables: { id: '1' },
    });
    expect(queryByTestId('ReportCommentCard')).toBeTruthy();
    expect(queryByTestId('UnreadCommentsCard')).toBeNull();
  });
});

it('navigates to unread comments screen', async () => {
  const { snapshot, getByTestId } = renderWithContext(
    <CelebrateFeedHeader organization={organization} isMember={false} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
    variables: { id: '1' },
  });

  fireEvent.press(getByTestId('UnreadCommentsCard'));

  expect(navigatePush).toHaveBeenCalledWith(GROUP_UNREAD_FEED_SCREEN, {
    organization,
  });
});

it('closes comment card', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <CelebrateFeedHeader isMember={false} organization={organization} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
    variables: { id: '1' },
  });

  fireEvent(getByTestId('UnreadCommentsCard'), 'onClose');

  expect(markCommentsRead).toHaveBeenCalled();
});

it('navigates to group report screen', async () => {
  const { getByTestId, snapshot } = renderWithContext(
    <CelebrateFeedHeader isMember={false} organization={organization} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
    variables: { id: '1' },
  });

  fireEvent.press(getByTestId('ReportCommentCard'));

  expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
    organization,
  });
});
