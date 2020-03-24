import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ORG_PERMISSIONS } from '../../../constants';
import {
  testSnapshotShallow,
  renderShallow,
  createThunkStore,
} from '../../../../testUtils';
import { orgPermissionSelector } from '../../../selectors/people';

import AddContactFields from '..';

jest.mock('../../../selectors/people');

const mockStore = configureStore([thunk]);
const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };

const state = { auth: { person: {} } };

// @ts-ignore
function buildScreen(props, builtStore) {
  return renderShallow(
    <AddContactFields onUpdateData={jest.fn()} {...props} />,
    builtStore || createThunkStore(state),
  );
}

beforeEach(() => {
  // @ts-ignore
  orgPermissionSelector.mockReturnValue(orgPermission);
});

it('renders casey view correctly', () => {
  testSnapshotShallow(
    <AddContactFields
      // @ts-ignore
      onUpdateData={jest.fn()}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={null}
    />,
    mockStore(),
  );
});

it('renders jean without organization view correctly', () => {
  testSnapshotShallow(
    <AddContactFields
      // @ts-ignore
      onUpdateData={jest.fn()}
      isJean={true}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={{}}
    />,
    mockStore(),
  );
});

it('renders jean with organization view correctly', () => {
  testSnapshotShallow(
    <AddContactFields
      // @ts-ignore
      onUpdateData={jest.fn()}
      isJean={true}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={{ id: '1' }}
    />,
    mockStore({ auth: { person: {} } }),
  );
});

it('renders jean with organization and user radio buttons', () => {
  testSnapshotShallow(
    <AddContactFields
      // @ts-ignore
      onUpdateData={jest.fn()}
      isJean={true}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={{ id: '1' }}
    />,
    mockStore({
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: '1',
              permission_id: ORG_PERMISSIONS.USER,
            },
          ],
        },
      },
    }),
  );
});

it('renders jean with organization and user and admin radio buttons', () => {
  testSnapshotShallow(
    <AddContactFields
      // @ts-ignore
      onUpdateData={jest.fn()}
      isJean={true}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={{ id: '1' }}
    />,
    mockStore({
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: '1',
              permission_id: ORG_PERMISSIONS.ADMIN,
            },
          ],
        },
      },
    }),
  );
});

it('renders jean invite with organization and user and admin radio buttons', () => {
  testSnapshotShallow(
    <AddContactFields
      // @ts-ignore
      onUpdateData={jest.fn()}
      isJean={true}
      isGroupInvite={true}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={{ id: '1' }}
    />,
    mockStore({
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: '1',
              permission_id: ORG_PERMISSIONS.ADMIN,
            },
          ],
        },
      },
    }),
  );
});

it('mounts and calls update field', () => {
  // @ts-ignore
  const component = buildScreen({
    isJean: true,
    organization: { id: '1' },
  });
  const componentInstance = component.instance();
  // @ts-ignore
  componentInstance.updateField = jest.fn();
  // @ts-ignore
  componentInstance.componentDidMount();
  // @ts-ignore
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.CONTACT,
  });
});

it('mounts invite from admin and calls update field', () => {
  // @ts-ignore
  orgPermissionSelector.mockReturnValue({
    permission_id: ORG_PERMISSIONS.ADMIN,
  });
  const component = buildScreen(
    {
      isJean: true,
      isGroupInvite: true,
      organization: { id: '1' },
    },
    mockStore({
      auth: {
        person: {
          organizational_permissions: [
            {
              organization_id: '1',
              permission_id: ORG_PERMISSIONS.ADMIN,
            },
          ],
        },
      },
    }),
  );
  const componentInstance = component.instance();
  // @ts-ignore
  componentInstance.updateField = jest.fn();
  // @ts-ignore
  componentInstance.componentDidMount();
  // @ts-ignore
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.USER,
  });
});

it('updates org permission', () => {
  // @ts-ignore
  const component = buildScreen({
    isJean: true,
    organization: { id: '1' },
  });
  const componentInstance = component.instance();
  // @ts-ignore
  componentInstance.updateField = jest.fn();
  // @ts-ignore
  componentInstance.updateOrgPermission(ORG_PERMISSIONS.CONTACT);
  // @ts-ignore
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.CONTACT,
  });
  // @ts-ignore
  componentInstance.updateOrgPermission(ORG_PERMISSIONS.USER);
  // @ts-ignore
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.USER,
  });
  // @ts-ignore
  componentInstance.updateOrgPermission(ORG_PERMISSIONS.ADMIN);
  // @ts-ignore
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.ADMIN,
  });
});

describe('calls methods', () => {
  // @ts-ignore
  const instance = buildScreen({
    isJean: true,
    organization: { id: '1' },
  }).instance();
  beforeEach(() => {
    instance.updateField = jest.fn();
    instance.isCurrentField = jest.fn();
  });

  it('calls changeFocusedField | firstName', () => {
    instance.changeFocusedField('firstName');
    expect(instance.updateField).toHaveBeenCalledWith(
      'currentInputField',
      'firstName',
    );
    instance.isCurrentField('firstName');
    expect(instance.isCurrentField).toHaveBeenCalledWith('firstName');
  });

  it('calls changeFocusedField | lastName', () => {
    instance.changeFocusedField('lastName');
    expect(instance.updateField).toHaveBeenCalledWith(
      'currentInputField',
      'lastName',
    );
    instance.isCurrentField('lastName');
    expect(instance.isCurrentField).toHaveBeenCalledWith('lastName');
  });

  it('calls first name ref', () => {
    const ref = 'test';
    instance.firstNameRef(ref);
    expect(instance.firstName).toEqual(ref);
  });
  it('calls last name ref', () => {
    const ref = 'test';
    instance.lastNameRef(ref);
    expect(instance.lastName).toEqual(ref);
  });
  it('calls email ref', () => {
    const ref = 'test';
    instance.emailRef(ref);
    expect(instance.email).toEqual(ref);
  });
  it('calls phone ref', () => {
    const ref = 'test';
    instance.phoneRef(ref);
    expect(instance.phone).toEqual(ref);
  });
  it('calls last name focus', () => {
    instance.lastName = { focus: jest.fn() };
    instance.lastNameFocus();
    expect(instance.lastName.focus).toHaveBeenCalled();
  });
  it('calls email focus', () => {
    instance.email = { focus: jest.fn() };
    instance.emailFocus();
    expect(instance.email.focus).toHaveBeenCalled();
  });
  it('calls phone focus', () => {
    instance.phone = { focus: jest.fn() };
    instance.phoneFocus();
    expect(instance.phone.focus).toHaveBeenCalled();
  });
  it('calls update first name', () => {
    instance.updateFirstName('test');
    expect(instance.updateField).toHaveBeenCalledWith('firstName', 'test');
  });
  it('calls update last name', () => {
    instance.updateLastName('test');
    expect(instance.updateField).toHaveBeenCalledWith('lastName', 'test');
  });
  it('calls update email', () => {
    instance.updateEmail('test');
    expect(instance.updateField).toHaveBeenCalledWith('email', 'test');
  });
  it('calls update phone', () => {
    instance.updatePhone('test');
    expect(instance.updateField).toHaveBeenCalledWith('phone', 'test');
  });
  it('calls update gender male', () => {
    instance.updateGenderMale();
    expect(instance.updateField).toHaveBeenCalledWith('gender', 'Male');
  });
  it('calls update gender female', () => {
    instance.updateGenderFemale();
    expect(instance.updateField).toHaveBeenCalledWith('gender', 'Female');
  });
});
