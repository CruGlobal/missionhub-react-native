import React from 'react';

import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import {
  renderShallow,
  testSnapshotShallow,
  createMockStore,
} from '../../../../testUtils';

import GroupMemberItem from '..';

jest.mock('../../../selectors/people');

const stage = {
  id: 1,
  name: 'Uninterested',
};

const myId = '1';
const me = {
  id: myId,
  full_name: 'Me',
  stage,
};

const member = {
  id: '123',
  full_name: 'Full Name',
  contact_count: 5,
  uncontacted_count: 3,
};

const orgPermission = { id: '111' };

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

const organization = { id: '1234', user_created: false };

const reverse_contact_assignments = [
  { id: '555', assigned_to: { id: myId }, pathway_stage_id: stage.id },
];

const props = {
  onSelect: jest.mock(),
  person: member,
  myOrgPermission: orgPermission,
  myId,
  organization,
};

const store = createMockStore({
  auth: {
    person: me,
  },
  stages: {
    stagesObj: {
      [`${stage.id}`]: stage,
    },
  },
});

beforeEach(() => {
  orgPermissionSelector.mockReturnValue(memberPermissions);
});

describe('render contacts count', () => {
  describe('user created org', () => {
    const newOrg = { ...organization, user_created: true };

    it('should render no stage, member permissions', () => {
      testSnapshotShallow(
        <GroupMemberItem {...{ ...props, organization: newOrg }} />,
        store,
      );
    });

    it('should render no stage, admin permissions', () => {
      orgPermissionSelector.mockReturnValue(adminPermissions);
      testSnapshotShallow(
        <GroupMemberItem {...{ ...props, organization: newOrg }} />,
        store,
      );
    });

    it('should render no stage, owner permissions', () => {
      orgPermissionSelector.mockReturnValue(ownerPermissions);
      testSnapshotShallow(
        <GroupMemberItem {...{ ...props, organization: newOrg }} />,
        store,
      );
    });

    it('should render stage, member permissions', () => {
      const newMember = {
        ...member,
        reverse_contact_assignments,
      };
      testSnapshotShallow(
        <GroupMemberItem
          {...{ ...props, organization: newOrg, person: newMember }}
        />,
        store,
      );
    });

    it('should render stage, admin permissions', () => {
      const newMember = {
        ...member,
        reverse_contact_assignments,
      };
      orgPermissionSelector.mockReturnValue(adminPermissions);
      testSnapshotShallow(
        <GroupMemberItem
          {...{ ...props, organization: newOrg, person: newMember }}
        />,
        store,
      );
    });

    it('should render stage, owner permissions', () => {
      const newMember = {
        ...member,
        reverse_contact_assignments,
      };
      orgPermissionSelector.mockReturnValue(ownerPermissions);
      testSnapshotShallow(
        <GroupMemberItem
          {...{ ...props, organization: newOrg, person: newMember }}
        />,
        store,
      );
    });
  });

  describe('cru org', () => {
    it('should render assigned and uncontacted', () => {
      testSnapshotShallow(<GroupMemberItem {...props} />, store);
    });

    it('should render 0 assigned', () => {
      const newMember = { ...member, contact_count: 0 };
      testSnapshotShallow(
        <GroupMemberItem {...{ ...props, person: newMember }} />,
        store,
      );
    });

    it('should render 0 uncontacted', () => {
      const newMember = { ...member, uncontacted_count: 0 };
      testSnapshotShallow(
        <GroupMemberItem {...{ ...props, person: newMember }} />,
        store,
      );
    });
  });
});

describe('render MemberOptionsMenu', () => {
  it('should render menu if person is me', () => {
    orgPermissionSelector.mockReturnValue(memberPermissions);
    const newMember = { ...member, id: myId };
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, person: newMember }} />,
      store,
    );
  });

  it('should render menu if I am admin and person is not owner', () => {
    orgPermissionSelector.mockReturnValue(memberPermissions);
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, myOrgPermission: adminPermissions }} />,
      store,
    );
  });

  it('should not render menu if person is owner', () => {
    orgPermissionSelector.mockReturnValue(ownerPermissions);
    testSnapshotShallow(
      <GroupMemberItem {...{ ...props, myOrgPermission: adminPermissions }} />,
      store,
    );
  });

  it('should not render menu if I am member', () => {
    orgPermissionSelector.mockReturnValue(memberPermissions);
    testSnapshotShallow(<GroupMemberItem {...props} />, store);
  });
});

describe('onSelect', () => {
  it('calls onSelect prop', () => {
    const onSelect = jest.fn();

    renderShallow(<GroupMemberItem {...{ ...props, onSelect }} />, store)
      .instance()
      .handleSelect();

    expect(onSelect).toHaveBeenCalled();
  });
});
