import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { orgPermissionSelector } from '../../../selectors/people';
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

const myId = '1';
const me = { id: myId, full_name: 'Me' };

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

const organization = { id: '1234', user_created: false };
const userOrg = { ...organization, user_created: true };

const initialState = {
  auth: { person: me },
  organizations: { all: [organization] },
};

const props = {
  person: member,
  personOrgPermission: memberPermissions,
  organization,
  onRefreshMembers: jest.fn(),
};

beforeEach(() => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    adminPermissions,
  );
});

describe('render contacts count', () => {
  describe('user created org', () => {
    it('should not crash without my org permission', () => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(null);

      renderWithContext(
        <CommunityMemberItem {...props} organization={userOrg} />,
        { initialState },
      );
    });

    it('should render member permissions', () => {
      renderWithContext(
        <CommunityMemberItem {...props} organization={userOrg} />,
        { initialState },
      ).snapshot();
    });

    it('should render admin permissions', () => {
      renderWithContext(
        <CommunityMemberItem
          {...props}
          organization={userOrg}
          personOrgPermission={adminPermissions}
        />,
        { initialState },
      ).snapshot();
    });

    it('should render owner permissions', () => {
      renderWithContext(
        <CommunityMemberItem
          {...props}
          organization={userOrg}
          personOrgPermission={ownerPermissions}
        />,
        { initialState },
      ).snapshot();
    });
  });
});

describe('render MemberOptionsMenu', () => {
  it('should render menu if person is me', () => {
    renderWithContext(
      <CommunityMemberItem {...props} person={{ ...member, id: myId }} />,
      { initialState },
    ).snapshot();
  });

  it('should render menu if I am admin and person is not owner', () => {
    renderWithContext(
      <CommunityMemberItem
        {...props}
        personOrgPermission={memberPermissions}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('should not render menu if person is owner', () => {
    renderWithContext(
      <CommunityMemberItem {...props} personOrgPermission={ownerPermissions} />,
      { initialState },
    ).snapshot();
  });

  it('should not render menu if I am member', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      memberPermissions,
    );
    renderWithContext(
      <CommunityMemberItem
        {...props}
        personOrgPermission={memberPermissions}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('nav to person', () => {
  it('should nav to person', () => {
    const { getByTestId } = renderWithContext(
      <CommunityMemberItem {...props} person={{ ...member, id: myId }} />,
      { initialState },
    );

    fireEvent.press(getByTestId('CommunityMemberItem'));
    expect(navigatePush).toHaveBeenCalled();
  });
});
