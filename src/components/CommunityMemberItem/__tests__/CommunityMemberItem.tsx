import React from 'react';
import { fireEvent, flushMicrotasksQueue } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { mockFragment } from '../../../../testUtils/apolloMockClient';
import { CommunityMemberPerson } from '../__generated__/CommunityMemberPerson';
import { COMMUNITY_MEMBER_PERSON_FRAGMENT } from '../queries';
import { PermissionEnum } from '../../../../__generated__/globalTypes';
import { navigatePush } from '../../../actions/navigation';
import { CommunityMembers_community_people_edges_communityPermission } from '../../../containers/Communities/Community/CommunityMembers/__generated__/CommunityMembers';
import CommunityMemberItem from '..';

jest.mock('../../../selectors/people');
jest.mock('../../../actions/navigation', () => ({
  navigatePush: jest.fn().mockReturnValue({ type: 'navigatePush' }),
}));
jest.mock('../../../auth/authStore', () => ({ isAuthenticated: () => true }));

const myId = '1';

const createdAt = '2020-05-25 13:00:00';

const member = mockFragment<CommunityMemberPerson>(
  COMMUNITY_MEMBER_PERSON_FRAGMENT,
);

const orgPerm: CommunityMembers_community_people_edges_communityPermission = {
  id: '111',
  __typename: 'CommunityPermission',
  permission: PermissionEnum.user,
  createdAt,
};

const memberPermissions = { ...orgPerm, permission: PermissionEnum.user };
const adminPermissions = { ...orgPerm, permission: PermissionEnum.admin };
const ownerPermissions = { ...orgPerm, permission: PermissionEnum.owner };

const organization = { id: '1234' };

const initialState = {
  organizations: { all: [organization] },
};

const props = {
  person: member,
  personOrgPermission: memberPermissions,
  organization,
  onRefreshMembers: jest.fn(),
  myCommunityPermission: memberPermissions,
};

describe('render contacts count', () => {
  it('should not crash without my org permission', () => {
    expect(() =>
      renderWithContext(
        <CommunityMemberItem {...props} organization={organization} />,
        {
          initialState,
          mocks: { User: () => ({ person: () => ({ id: myId }) }) },
        },
      ),
    ).not.toThrow();
  });

  it('should render member permissions', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem {...props} organization={organization} />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('should render admin permissions', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem
        {...props}
        organization={organization}
        personOrgPermission={adminPermissions}
        myCommunityPermission={adminPermissions}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('should render owner permissions', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem
        {...props}
        organization={organization}
        personOrgPermission={ownerPermissions}
        myCommunityPermission={ownerPermissions}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });
});

describe('render MemberOptionsMenu', () => {
  it('should render menu if person is me', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem {...props} person={{ ...member, id: myId }} />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('should render menu if I am admin and person is not owner', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem
        {...props}
        personOrgPermission={memberPermissions}
        myCommunityPermission={adminPermissions}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('should not render menu if person is owner', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem
        {...props}
        personOrgPermission={ownerPermissions}
        myCommunityPermission={adminPermissions}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });

  it('should not render menu if I am member', async () => {
    const { snapshot } = renderWithContext(
      <CommunityMemberItem
        {...props}
        personOrgPermission={memberPermissions}
      />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    await flushMicrotasksQueue();

    snapshot();
  });
});

describe('nav to person', () => {
  it('should nav to person', () => {
    const { getByTestId } = renderWithContext(
      <CommunityMemberItem {...props} person={{ ...member, id: myId }} />,
      {
        initialState,
        mocks: { User: () => ({ person: () => ({ id: myId }) }) },
      },
    );

    fireEvent.press(getByTestId('CommunityMemberItem'));
    expect(navigatePush).toHaveBeenCalled();
  });
});
