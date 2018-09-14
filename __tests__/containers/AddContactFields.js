import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { ORG_PERMISSIONS } from '../../src/constants';
import AddContactFields from '../../src/containers/AddContactFields';
import {
  testSnapshotShallow,
  renderShallow,
  createMockStore,
} from '../../testUtils';
import { orgPermissionSelector } from '../../src/selectors/people';

jest.mock('../../src/selectors/people');

const mockStore = configureStore([thunk]);
const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };

const store = createMockStore();
function buildScreen(props, builtStore) {
  return renderShallow(
    <AddContactFields onUpdateData={jest.fn()} {...props} />,
    builtStore || store,
  );
}

beforeEach(() => {
  orgPermissionSelector.mockReturnValue(orgPermission);
});

it('renders casey view correctly', () => {
  testSnapshotShallow(
    <AddContactFields
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
      onUpdateData={jest.fn()}
      isJean={true}
      person={{
        email_addresses: [],
        phone_numbers: [],
      }}
      organization={{ id: '1' }}
    />,
    mockStore(),
  );
});

it('renders jean with organization and user radio buttons', () => {
  testSnapshotShallow(
    <AddContactFields
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
  const component = buildScreen({
    isJean: true,
    organization: { id: '1' },
  });
  const componentInstance = component.instance();
  componentInstance.updateField = jest.fn();
  componentInstance.componentDidMount();
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.CONTACT,
  });
});

it('mounts invite from admin and calls update field', () => {
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
  componentInstance.updateField = jest.fn();
  componentInstance.componentDidMount();
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.USER,
  });
});

it('updates org permission', () => {
  const component = buildScreen({
    isJean: true,
    organization: { id: '1' },
  });
  const componentInstance = component.instance();
  componentInstance.updateField = jest.fn();
  componentInstance.updateOrgPermission(ORG_PERMISSIONS.CONTACT);
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.CONTACT,
  });
  componentInstance.updateOrgPermission(ORG_PERMISSIONS.USER);
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.USER,
  });
  componentInstance.updateOrgPermission(ORG_PERMISSIONS.ADMIN);
  expect(componentInstance.updateField).toHaveBeenCalledWith('orgPermission', {
    permission_id: ORG_PERMISSIONS.ADMIN,
  });
});

describe('calls methods', () => {
  const instance = buildScreen({
    isJean: true,
    organization: { id: '1' },
  }).instance();
  beforeEach(() => {
    instance.updateField = jest.fn();
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
