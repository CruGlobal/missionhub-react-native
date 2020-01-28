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

import CelebrateFeedHeader from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');

(markCommentsRead as jest.Mock).mockReturnValue(() => ({
  type: 'markCommentsRead',
}));
(navigatePush as jest.Mock).mockReturnValue(() => ({ type: 'navigatePush' }));

const comment1 = { id: 'reported1' };
const organization = {
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
  reportedComments: {
    all: {
      [organization.id]: [comment1],
    },
  },
  swipe: {
    groupOnboarding: {
      [GROUP_ONBOARDING_TYPES.steps]: true,
    },
  },
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
      const { snapshot, getByTestId, queryByText } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
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
      expect(getByTestId('ReportCommentHeaderCardButton')).toBeTruthy();
      expect(queryByText('1 new reported item')).toBeTruthy();
    });

    it('renders with multiple reported items', async () => {
      const { snapshot, getByTestId, queryByText } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(getByTestId('ReportCommentHeaderCardButton')).toBeTruthy();
      expect(queryByText('2 new reported items')).toBeTruthy();
    });

    it('renders with multiple reported items but no unreadComments', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        unread_comments_count: 0,
      });
      const { snapshot, getByTestId, queryByText } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      expect(getByTestId('ReportCommentHeaderCardButton')).toBeTruthy();
      expect(queryByText('2 new reported items')).toBeTruthy();
      expect(queryByText('New Comments')).toBeNull();
    });
  });

  describe('cru community', () => {
    it('renders with 1 reported item', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, getByTestId, queryByText } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
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
      expect(getByTestId('ReportCommentHeaderCardButton')).toBeTruthy();
      expect(queryByText('1 new reported item')).toBeTruthy();
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
        <CelebrateFeedHeader organization={globalCommunity} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });
  });

  it('renders with 0 reported items', async () => {
    const { snapshot, queryByTestId } = renderWithContext(
      <CelebrateFeedHeader organization={organization} />,
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
    expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
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
        <CelebrateFeedHeader organization={organization} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });
  });

  describe('cru community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });

    it('renders with multiple reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeTruthy();
    });
  });

  describe('global community', () => {
    it('renders without reported comments', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={globalCommunity} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });

    it('renders with 0 reported comments', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={globalCommunity} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
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
        <CelebrateFeedHeader organization={organization} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });

    it('does not render the reported items card even when reported items exist', async () => {
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      snapshot();
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });
  });

  describe('cru community', () => {
    it('renders without reported items', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
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
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });
    it('does not render reported item card even when reported items exist', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
      snapshot();
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });
  });

  describe('global community', () => {
    it('renders without reported comments', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const { snapshot, queryByTestId } = renderWithContext(
        <CelebrateFeedHeader organization={organization} />,
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
        variables: { id: GLOBAL_COMMUNITY_ID },
      });
      snapshot();
      expect(queryByTestId('ReportCommentHeaderCardButton')).toBeNull();
    });
  });
});

describe('unread comments card', () => {
  it('renders comment card', async () => {
    const { snapshot, queryByText } = renderWithContext(
      <CelebrateFeedHeader organization={organization} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
      variables: { id: '1' },
    });
    expect(queryByText('New Comments')).toBeTruthy();
  });
  it('renders no comment card when global org', async () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });
    const { snapshot, queryByText } = renderWithContext(
      <CelebrateFeedHeader organization={globalCommunity} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();

    expect(queryByText('New Comments')).toBeFalsy();
  });
  it('renders no comment card when no new comments', async () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
      ...organization,
      unread_comments_count: 0,
    });
    const { snapshot, queryByText } = renderWithContext(
      <CelebrateFeedHeader organization={organization} />,
      {
        initialState,
      },
    );
    await flushMicrotasksQueue();
    snapshot();
    expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
      variables: { id: '1' },
    });
    expect(queryByText('New Comments')).toBeFalsy();
  });
});

it('navigates to unread comments screen', async () => {
  const { snapshot, getByTestId } = renderWithContext(
    <CelebrateFeedHeader organization={organization} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
    variables: { id: '1' },
  });

  await fireEvent.press(getByTestId('CardButton'));
  expect(navigatePush).toHaveBeenCalledWith(GROUP_UNREAD_FEED_SCREEN, {
    organization,
  });
});

it('closes comment card', async () => {
  const { snapshot, getByTestId } = renderWithContext(
    <CelebrateFeedHeader organization={organization} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
    variables: { id: '1' },
  });

  await fireEvent.press(getByTestId('IconButton'));
  expect(markCommentsRead).toHaveBeenCalled();
});

it('navigates to group report screen', async () => {
  const { snapshot, getByTestId } = renderWithContext(
    <CelebrateFeedHeader organization={organization} />,
    {
      initialState,
    },
  );
  await flushMicrotasksQueue();
  snapshot();
  expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
    variables: { id: '1' },
  });

  await fireEvent.press(getByTestId('ReportCommentHeaderCardButton'));

  expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
    organization,
  });
});
