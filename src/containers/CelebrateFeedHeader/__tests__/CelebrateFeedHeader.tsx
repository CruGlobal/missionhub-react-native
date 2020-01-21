import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { getReportedComments } from '../../../actions/reportComments';
import { orgPermissionSelector } from '../../../selectors/people';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS, GLOBAL_COMMUNITY_ID } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../../Groups/GroupReport';
import { markCommentsRead } from '../../../actions/unreadComments';
import { GROUP_UNREAD_FEED_SCREEN } from '../../Groups/GroupUnreadFeed';

import CelebrateFeedHeader from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');

// @ts-ignore
getReportedComments.mockReturnValue(() => ({ type: 'getReportedComments' }));
// @ts-ignore
markCommentsRead.mockReturnValue(() => ({ type: 'markCommentsRead' }));
// @ts-ignore
navigatePush.mockReturnValue(() => ({ type: 'navigatePush' }));

const mockStore = configureStore([thunk]);
const comment1 = { id: 'reported1' };
const organization = {
  id: '1',
  user_created: true,
  reportedComments: [comment1],
  unread_comments_count: 12,
};
const me = { id: 'myId' };

const mockStoreObj = {
  organizations: [],
  auth: {
    person: me,
  },
  reportedComments: {
    all: {
      [organization.id]: [comment1],
    },
  },
};
// @ts-ignore
let store;

beforeEach(() => {
  // @ts-ignore
  organizationSelector.mockReturnValue(organization);
  // @ts-ignore
  orgPermissionSelector.mockReturnValue({
    permission_id: ORG_PERMISSIONS.OWNER,
  });
  store = mockStore(mockStoreObj);
});

function buildScreen() {
  return renderShallow(
    <CelebrateFeedHeader organization={organization} />,
    // @ts-ignore
    store,
  );
}

describe('owner', () => {
  describe('user created community', () => {
    it('renders with 1 reported comment', () => {
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).toHaveBeenCalledWith(organization.id);
    });
  });

  describe('cru community', () => {
    it('renders with 1 reported comment', () => {
      // @ts-ignore
      organizationSelector.mockReturnValue({
        ...organization,
        user_created: false,
      });
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).toHaveBeenCalledWith(organization.id);
    });
  });

  describe('global community', () => {
    it('renders without reported comments', () => {
      // @ts-ignore
      organizationSelector.mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  it('renders with 0 reported comments', () => {
    store = mockStore({ ...mockStoreObj, reportedComments: { all: {} } });
    const screen = buildScreen();

    expect(screen).toMatchSnapshot();
    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
});

describe('admin', () => {
  beforeEach(() => {
    // @ts-ignore
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
  });

  describe('user created community', () => {
    it('renders with 1 reported comment', () => {
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  describe('cru community', () => {
    it('renders without reported comments', () => {
      // @ts-ignore
      organizationSelector.mockReturnValue({
        ...organization,
        user_created: false,
      });
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).toHaveBeenCalledWith(organization.id);
    });
  });

  describe('global community', () => {
    it('renders without reported comments', () => {
      // @ts-ignore
      organizationSelector.mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  it('renders with 0 reported comments', () => {
    // @ts-ignore
    organizationSelector.mockReturnValue({
      ...organization,
      user_created: false,
    });
    store = mockStore({ ...mockStoreObj, reportedComments: { all: {} } });
    const screen = buildScreen();

    expect(screen).toMatchSnapshot();
    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
});

describe('members', () => {
  beforeEach(() => {
    // @ts-ignore
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
  });

  describe('user created community', () => {
    it('renders without reported comments', () => {
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  describe('cru community', () => {
    it('renders without reported comments', () => {
      // @ts-ignore
      organizationSelector.mockReturnValue({
        ...organization,
        user_created: false,
      });
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });

  describe('global community', () => {
    it('renders without reported comments', () => {
      // @ts-ignore
      organizationSelector.mockReturnValue({
        ...organization,
        id: GLOBAL_COMMUNITY_ID,
        user_created: false,
      });
      const screen = buildScreen();

      expect(screen).toMatchSnapshot();
      expect(getReportedComments).not.toHaveBeenCalled();
    });
  });
});

describe('unread comments card', () => {
  it('renders comment card', () => {
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders no comment card when global org', () => {
    // @ts-ignore
    organizationSelector.mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders no comment card when no new comments', () => {
    // @ts-ignore
    organizationSelector.mockReturnValue({
      ...organization,
      unread_comments_count: 0,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
});

it('navigates to unread comments screen', () => {
  const screen = buildScreen();
  screen
    .childAt(0)
    .childAt(0)
    .props()
    .onPress();

  expect(navigatePush).toHaveBeenCalledWith(GROUP_UNREAD_FEED_SCREEN, {
    organization,
  });
});

it('closes comment card', () => {
  const screen = buildScreen();
  screen
    .childAt(0)
    .childAt(0)
    .props()
    .onClose();

  expect(markCommentsRead).toHaveBeenCalled();
});

it('navigates to group report screen', () => {
  const screen = buildScreen();
  screen
    .childAt(0)
    .childAt(2)
    .props()
    .onPress();

  expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
    organization,
  });
});
