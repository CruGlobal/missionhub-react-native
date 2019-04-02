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

import CelebrateFeedHeader from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');
jest.mock('../../../actions/unreadComments');

getReportedComments.mockReturnValue(() => ({ type: 'getReportedComments' }));
markCommentsRead.mockReturnValue(() => ({ type: 'markCommentsRead' }));
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
let store;

beforeEach(() => {
  organizationSelector.mockReturnValue(organization);
  orgPermissionSelector.mockReturnValue({
    permission_id: ORG_PERMISSIONS.OWNER,
  });
  store = mockStore(mockStoreObj);
});

function buildScreen() {
  return renderShallow(
    <CelebrateFeedHeader organization={organization} />,
    store,
  );
}

describe('owner', () => {
  it('renders owner with 1 reported comment', () => {
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
  it('renders owner with 0 reported comment', () => {
    store = mockStore({ ...mockStoreObj, reportedComments: { all: {} } });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
});

describe('unread comments card', () => {
  it('renders comment card', () => {
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders no comment card when global org', () => {
    organizationSelector.mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
  it('renders no comment card when no new comments', () => {
    organizationSelector.mockReturnValue({
      ...organization,
      unread_comments_count: 0,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
  });
});

describe('admin', () => {
  beforeEach(() => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
  });
  it('renders admin of cru org with 1 reported comment', () => {
    organizationSelector.mockReturnValue({
      ...organization,
      user_created: false,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).toHaveBeenCalledWith(organization.id);
  });
  it('renders admin of not cru org', () => {
    organizationSelector.mockReturnValue(organization);
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
  it('renders admin of global org', () => {
    organizationSelector.mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
});

describe('cru community org', () => {
  beforeEach(() => {
    organizationSelector.mockReturnValue({
      ...organization,
      user_created: false,
    });
  });
  it('renders user', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
  it('renders owner', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.OWNER,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
});

describe('global community org', () => {
  beforeEach(() => {
    organizationSelector.mockReturnValue({
      ...organization,
      id: GLOBAL_COMMUNITY_ID,
    });
  });
  it('renders user', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
});

describe('not owner', () => {
  it('renders admin', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.ADMIN,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
  it('renders user', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.USER,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
});

it('navigates to unread comments screen', () => {
  const screen = buildScreen();
  screen
    .childAt(0)
    .childAt(0)
    .props()
    .onPress();

  // expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
  //   organization,
  // });
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
