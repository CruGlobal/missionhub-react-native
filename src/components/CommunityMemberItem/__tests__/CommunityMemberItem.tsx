import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { renderWithContext } from '../../../../testUtils';

import CommunityMemberItem from '..';

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
  onSelect: jest.fn(),
  person: member,
  myOrgPermission: orgPermission,
  myId,
  organization,
};

const initialState = {
  auth: { person: me },
  stages: {
    stagesObj: {
      [`${stage.id}`]: stage,
    },
  },
};

beforeEach(() => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    memberPermissions,
  );
});

describe('render contacts count', () => {
  describe('user created org', () => {
    const newOrg = { ...organization, user_created: true };

    it('should not crash without an org permission', () => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(null);

      renderWithContext(
        <CommunityMemberItem {...{ ...props, organization: newOrg }} />,
        { initialState },
      );
    });

    it('should render no stage, member permissions', () => {
      renderWithContext(
        <CommunityMemberItem {...{ ...props, organization: newOrg }} />,
        { initialState },
      ).snapshot();
    });

    it('should render no stage, admin permissions', () => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
        adminPermissions,
      );
      renderWithContext(
        <CommunityMemberItem {...{ ...props, organization: newOrg }} />,
        { initialState },
      ).snapshot();
    });

    it('should render no stage, owner permissions', () => {
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
        ownerPermissions,
      );
      renderWithContext(
        <CommunityMemberItem {...{ ...props, organization: newOrg }} />,
        { initialState },
      ).snapshot();
    });

    it('should render stage, member permissions', () => {
      const newMember = {
        ...member,
        reverse_contact_assignments,
      };
      renderWithContext(
        <CommunityMemberItem
          {...{ ...props, organization: newOrg, person: newMember }}
        />,
        { initialState },
      ).snapshot();
    });

    it('should render stage, admin permissions', () => {
      const newMember = {
        ...member,
        reverse_contact_assignments,
      };
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
        adminPermissions,
      );
      renderWithContext(
        <CommunityMemberItem
          {...{ ...props, organization: newOrg, person: newMember }}
        />,
        { initialState },
      ).snapshot();
    });

    it('should render stage, owner permissions', () => {
      const newMember = {
        ...member,
        reverse_contact_assignments,
      };
      ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
        ownerPermissions,
      );
      renderWithContext(
        <CommunityMemberItem
          {...{ ...props, organization: newOrg, person: newMember }}
        />,
        { initialState },
      ).snapshot();
    });
  });

  describe('cru org', () => {
    it('should render assigned and uncontacted', () => {
      renderWithContext(<CommunityMemberItem {...props} />, {
        initialState,
      }).snapshot();
    });

    it('should render 0 assigned', () => {
      const newMember = { ...member, contact_count: 0 };
      renderWithContext(
        <CommunityMemberItem {...{ ...props, person: newMember }} />,
        { initialState },
      ).snapshot();
    });

    it('should render 0 uncontacted', () => {
      const newMember = { ...member, uncontacted_count: 0 };
      renderWithContext(
        <CommunityMemberItem {...{ ...props, person: newMember }} />,
        { initialState },
      ).snapshot();
    });
  });
});

describe('render MemberOptionsMenu', () => {
  it('should render menu if person is me', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      memberPermissions,
    );
    const newMember = { ...member, id: myId };
    renderWithContext(
      <CommunityMemberItem {...{ ...props, person: newMember }} />,
      { initialState },
    ).snapshot();
  });

  it('should render menu if I am admin and person is not owner', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      memberPermissions,
    );
    renderWithContext(
      <CommunityMemberItem
        {...{ ...props, myOrgPermission: adminPermissions }}
      />,
      { initialState },
    ).snapshot();
  });

  it('should not render menu if person is owner', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      ownerPermissions,
    );
    renderWithContext(
      <CommunityMemberItem
        {...{ ...props, myOrgPermission: adminPermissions }}
      />,
      { initialState },
    ).snapshot();
  });

  it('should not render menu if I am member', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      memberPermissions,
    );
    renderWithContext(<CommunityMemberItem {...props} />, {
      initialState,
    }).snapshot();
  });
});

describe('onSelect', () => {
  it('calls onSelect prop', () => {
    const onSelect = jest.fn();
    const { getByTestId } = renderWithContext(
      <CommunityMemberItem {...{ ...props, onSelect }} />,
      { initialState },
    );
    fireEvent.press(getByTestId('CommunityMemberItem'));

    expect(onSelect).toHaveBeenCalled();
  });
});
