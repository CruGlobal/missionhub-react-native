import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { renderShallow } from '../../../../testUtils';
import { getReportedComments } from '../../../actions/reportComments';
import { orgPermissionSelector } from '../../../selectors/people';
import { organizationSelector } from '../../../selectors/organizations';
import { ORG_PERMISSIONS } from '../../../constants';
import { navigatePush } from '../../../actions/navigation';
import { GROUPS_REPORT_SCREEN } from '../../Groups/GroupReport';

import ReportCommentNotifier from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../selectors/organizations');
jest.mock('../../../actions/reportComments');
jest.mock('../../../actions/navigation');

getReportedComments.mockReturnValue(() => ({ type: 'getReportedComments' }));
navigatePush.mockReturnValue(() => ({ type: 'navigatePush' }));

const mockStore = configureStore([thunk]);
const comment1 = { id: 'reported1' };
const organization = {
  id: '1',
  reportedComments: [comment1],
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
    <ReportCommentNotifier organization={organization} />,
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
  it('renders contact', () => {
    orgPermissionSelector.mockReturnValue({
      permission_id: ORG_PERMISSIONS.CONTACT,
    });
    const screen = buildScreen();
    expect(screen).toMatchSnapshot();
    expect(getReportedComments).not.toHaveBeenCalled();
  });
});

it('navigates to group report screen', () => {
  const screen = buildScreen();
  screen
    .childAt(0)
    .props()
    .onPress();

  expect(navigatePush).toHaveBeenCalledWith(GROUPS_REPORT_SCREEN, {
    organization,
  });
});
