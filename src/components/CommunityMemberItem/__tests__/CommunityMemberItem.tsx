import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';
import { renderWithContext } from '../../../../testUtils';

import CommunityMemberItem from '..';

jest.mock('../../../selectors/people');

const myId = '1';
const me = { id: myId, full_name: 'Me' };

const member = {
  id: '123',
  firstName: 'Firstname',
  createdAt: '2020-04-15T12:00:00.000',
};

const orgPerm = { id: '111' };

const memberPermissions = { ...orgPerm, permission_id: ORG_PERMISSIONS.USER };
const adminPermissions = { ...orgPerm, permission_id: ORG_PERMISSIONS.ADMIN };
const ownerPermissions = { ...orgPerm, permission_id: ORG_PERMISSIONS.OWNER };

const organization = { id: '1234', user_created: false };
const userOrg = { ...organization, user_created: true };

const initialState = {
  auth: { person: me },
  organizations: { all: [organization] },
};

const props = {
  onSelect: jest.fn(),
  person: member,
  personOrgPermission: memberPermissions,
  organization,
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
        <CommunityMemberItem {...{ ...props, organization: userOrg }} />,
        { initialState },
      );
    });

    it('should render member permissions', () => {
      renderWithContext(
        <CommunityMemberItem {...{ ...props, organization: userOrg }} />,
        { initialState },
      ).snapshot();
    });

    it('should render admin permissions', () => {
      renderWithContext(
        <CommunityMemberItem
          {...{
            ...props,
            personOrgPermission: adminPermissions,
            organization: userOrg,
          }}
        />,
        { initialState },
      ).snapshot();
    });

    it('should render owner permissions', () => {
      renderWithContext(
        <CommunityMemberItem
          {...{
            ...props,
            personOrgPermission: ownerPermissions,
            organization: userOrg,
          }}
        />,
        { initialState },
      ).snapshot();
    });
  });
});

describe('render MemberOptionsMenu', () => {
  it('should render menu if person is me', () => {
    renderWithContext(
      <CommunityMemberItem
        {...{ ...props, person: { ...member, id: myId } }}
      />,
      { initialState },
    ).snapshot();
  });

  it('should render menu if I am admin and person is not owner', () => {
    renderWithContext(
      <CommunityMemberItem
        {...{ ...props, personOrgPermission: memberPermissions }}
      />,
      {
        initialState,
      },
    ).snapshot();
  });

  it('should not render menu if person is owner', () => {
    renderWithContext(
      <CommunityMemberItem
        {...{ ...props, personOrgPermission: ownerPermissions }}
      />,
      { initialState },
    ).snapshot();
  });

  it('should not render menu if I am member', () => {
    ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
      memberPermissions,
    );
    renderWithContext(
      <CommunityMemberItem
        {...{ ...props, personOrgPermission: memberPermissions }}
      />,
      {
        initialState,
      },
    ).snapshot();
  });
});

describe('onSelect', () => {
  it('calls onSelect prop', () => {
    const { getByTestId } = renderWithContext(
      <CommunityMemberItem {...props} />,
      { initialState },
    );
    fireEvent.press(getByTestId('CommunityMemberItem'));

    expect(props.onSelect).toHaveBeenCalled();
  });
});
