import React from 'react';

import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { renderShallow, testSnapshotShallow } from '../../../../testUtils';

import GroupMemberItem from '..';

jest.mock('../../../selectors/people');

const myId = '1';

const member = {
  id: '123',
  full_name: 'Full Name',
  contact_count: 5,
  uncontacted_count: 3,
};

const orgPermission = { id: '111', permission_id: ORG_PERMISSIONS.USER };
orgPermissionSelector.mockReturnValue(orgPermission);

const organization = { id: '1234', user_created: false };

const props = {
  onSelect: jest.mock(),
  person: member,
  myOrgPermissions: orgPermission,
  myId,
  organization,
};

describe('render contacts count', () => {
  describe('user created org', () => {
    const newOrg = { ...organization, user_created: true };
    it('should not render contacts count', () => {
      testSnapshotShallow(
        <GroupMemberItem {...{ ...props, organization: newOrg }} />,
      );
    });
  });

  describe('cru org', () => {
    it('should render assigned and uncontacted', () => {
      testSnapshotShallow(<GroupMemberItem {...props} />);
    });
  });

  it('should render 0 assigned', () => {
    const newMember = { ...member, contact_count: 0 };
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, person: newMember }} />,
    );
  });

  it('should render 0 uncontacted', () => {
    const newMember = { ...member, uncontacted_count: 0 };
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, person: newMember }} />,
    );
  });
});

describe('render MemberOptionsMenu', () => {
  const memberPermissions = {
    ...orgPermission,
    permission_id: ORG_PERMISSIONS.USER,
  };
  const adminPermissions = {
    ...orgPermission,
    permission_id: ORG_PERMISSIONS.ADMIN,
  };
  const ownerPermissions = {
    ...orgPermission,
    permission_id: ORG_PERMISSIONS.OWNER,
  };

  const props = {
    onSelect: jest.mock(),
    person: member,
    myOrgPermissions: memberPermissions,
    myId,
    organization,
  };

  it('should render menu if person is me', () => {
    orgPermissionSelector.mockReturnValue(memberPermissions);
    const newMember = { ...member, id: myId };
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, person: newMember }} />,
    );
  });

  it('should render menu if I am admin and person is not owner', () => {
    orgPermissionSelector.mockReturnValue(memberPermissions);
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, myOrgPermissions: adminPermissions }} />,
    );
  });

  it('should not render menu if person is owner', () => {
    orgPermissionSelector.mockReturnValue(ownerPermissions);
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, myOrgPermissions: adminPermissions }} />,
    );
  });

  it('should not render menu if I am member', () => {
    orgPermissionSelector.mockReturnValue(memberPermissions);
    testSnapshotShallow(<GroupMemberItem {...props} />);
  });
});

describe('with onSelect prop', () => {
  it('render member', () => {});

  it('calls onSelect prop', () => {
    const onSelect = jest.fn();

    renderShallow(
      <GroupMemberItem onSelect={onSelect} person={member} myId={myId} />,
    )
      .instance()
      .handleSelect();

    expect(onSelect).toHaveBeenCalled();
  });
});

describe('without onSelect prop', () => {
  it('renders', () => {
    testSnapshotShallow(<GroupMemberItem onSelect={null} person={member} />);
  });
});
