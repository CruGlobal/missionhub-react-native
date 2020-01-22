import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow, renderWithContext } from '../../../../testUtils';
import { getReportedComments } from '../../../actions/reportComments';
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
import { useQuery } from '@apollo/react-hooks';
import { flushMicrotasksQueue } from 'react-native-testing-library';
import { MockList } from 'graphql-tools';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');

(getReportedComments as jest.Mock).mockReturnValue(() => ({
  type: 'getReportedComments',
}));
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
  id: GLOBAL_COMMUNITY_ID,
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

describe('owner', () => {
  describe('user created community', () => {
    fit('renders with 1 reported comment', () => {
      const { snapshot } = renderWithContext(
        <CelebrateFeedHeader
          organization={organization}
          isMember={false}
          shouldQueryReport={true}
        />,
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

      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
    });
  });

  describe('cru community', () => {
    it('renders with 1 reported comment', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot } = renderWithContext(
        <CelebrateFeedHeader
          organization={organization}
          isMember={false}
          shouldQueryReport={true}
        />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
      expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
        variables: { id: '1' },
      });
    });
  });

  describe('global community', () => {
    it('renders without reported comments', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const { snapshot } = renderWithContext(
        <CelebrateFeedHeader
          organization={globalCommunity}
          isMember={false}
          shouldQueryReport={false}
        />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
    });
  });

  it('renders with 0 reported comments', async () => {
    const { snapshot } = renderWithContext(
      <CelebrateFeedHeader
        organization={organization}
        isMember={false}
        shouldQueryReport={false}
      />,
      {
        initialState: { ...initialState, reportComments: { all: {} } },
      },
    );
    await flushMicrotasksQueue();
    expect(useQuery).toHaveBeenCalledWith(GET_REPORTED_CONTENT, {
      variables: { id: '1' },
    });
    snapshot();
  });
});

describe('admin', () => {
  beforeEach(() => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
  });

  describe('user created community', () => {
    it('renders with 1 reported comment', async () => {
      const { snapshot } = renderWithContext(
        <CelebrateFeedHeader
          organization={organization}
          isMember={false}
          shouldQueryReport={false}
        />,
        {
          initialState,
        },
      );
      await flushMicrotasksQueue();
      snapshot();
    });
  });

  describe('cru community', () => {
    it('renders without reported comments', async () => {
      ((organizationSelector as unknown) as jest.Mock).mockReturnValue({
        ...organization,
        user_created: false,
      });
      const { snapshot } = renderWithContext(
        <CelebrateFeedHeader
          organization={organization}
          isMember={false}
          shouldQueryReport={false}
        />,
        {
          initialState: { ...initialState, reportComments: { all: {} } },
        },
      );
      await flushMicrotasksQueue();
      snapshot();
    });
  });

  //   describe('global community', () => {
  //     it('renders without reported comments', () => {
  //       organizationSelector.mockReturnValue({
  //         ...organization,
  //         id: GLOBAL_COMMUNITY_ID,
  //         user_created: false,
  //       });
  //       const screen = buildScreen();

  //       expect(screen).toMatchSnapshot();
  //       expect(getReportedComments).not.toHaveBeenCalled();
  //     });
  //   });

  //   it('renders with 0 reported comments', () => {
  //     organizationSelector.mockReturnValue({
  //       ...organization,
  //       user_created: false,
  //     });
  //     store = mockStore({ ...mockStoreObj, reportedComments: { all: {} } });
  //     const screen = buildScreen();

  //     expect(screen).toMatchSnapshot();
  //     expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  //   });
  // });

  // describe('members', () => {
  //   beforeEach(() => {
  //     orgPermissionSelector.mockReturnValue({
  //       permission_id: ORG_PERMISSIONS.USER,
  //     });
  //   });

  //   describe('user created community', () => {
  //     it('renders without reported comments', () => {
  //       const screen = buildScreen();

  //       expect(screen).toMatchSnapshot();
  //       expect(getReportedComments).not.toHaveBeenCalled();
  //     });
  //   });

  //   describe('cru community', () => {
  //     it('renders without reported comments', () => {
  //       organizationSelector.mockReturnValue({
  //         ...organization,
  //         user_created: false,
  //       });
  //       const screen = buildScreen();

  //       expect(screen).toMatchSnapshot();
  //       expect(getReportedComments).not.toHaveBeenCalled();
  //     });
  //   });

  //   describe('global community', () => {
  //     it('renders without reported comments', () => {
  //       organizationSelector.mockReturnValue({
  //         ...organization,
  //         id: GLOBAL_COMMUNITY_ID,
  //         user_created: false,
  //       });
  //       const screen = buildScreen();

  //       expect(screen).toMatchSnapshot();
  //       expect(getReportedComments).not.toHaveBeenCalled();
  //     });
  //   });
  // });

  // describe('unread comments card', () => {
  //   it('renders comment card', () => {
  //     const screen = buildScreen();
  //     expect(screen).toMatchSnapshot();
  //   });
  //   it('renders no comment card when global org', () => {
  //     organizationSelector.mockReturnValue({
  //       ...organization,
  //       id: GLOBAL_COMMUNITY_ID,
  //     });
  //     const screen = buildScreen();
  //     expect(screen).toMatchSnapshot();
  //   });
  //   it('renders no comment card when no new comments', () => {
  //     organizationSelector.mockReturnValue({
  //       ...organization,
  //       unread_comments_count: 0,
  //     });
  //     const screen = buildScreen();
  //     expect(screen).toMatchSnapshot();
  //   });
  // });

  // it('navigates to unread comments screen', () => {
  //   const screen = buildScreen();
  //   screen
  //     .childAt(0)
  //     .childAt(0)
  //     .props()
  //     .onPress();

  //   expect(navigatePush).toHaveBeenCalledWith(GROUP_UNREAD_FEED_SCREEN, {
  //     organization,
  //   });
  // });

  // it('closes comment card', () => {
  //   const screen = buildScreen();
  //   screen
  //     .childAt(0)
  //     .childAt(0)
  //     .props()
  //     .onClose();

  //   expect(markCommentsRead).toHaveBeenCalled();
  // });

  // it('navigates to group report screen', () => {
  //   const screen = buildScreen();
  //   screen
  //     .childAt(0)
  //     .childAt(2)
  //     .props()
  //     .onPress();

  //   expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
  //     organization,
  //   });
});
