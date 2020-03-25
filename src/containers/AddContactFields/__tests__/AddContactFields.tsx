/* eslint max-lines: 0 */
import React from 'react';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../testUtils';
import { ORG_PERMISSIONS } from '../../../constants';
import { orgPermissionSelector } from '../../../selectors/people';

import AddContactFields from '..';

jest.mock('../../../selectors/people');

const orgPermission = { permission_id: ORG_PERMISSIONS.CONTACT };

const initialState = { auth: { person: {} } };
const onUpdateData = jest.fn();

beforeEach(() => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue(
    orgPermission,
  );
});

it('renders casey view correctly', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      organization={null}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState,
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({});
});

it('renders jean without organization view correctly', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      organization={null}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState,
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: undefined,
    emailId: undefined,
    firstName: undefined,
    lastName: undefined,
    orgPermission: {
      permission_id: '',
    },
    phone: undefined,
    phoneId: undefined,
    userGender: undefined,
  });
});

it('renders jean with organization view correctly', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState,
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: undefined,
    emailId: undefined,
    firstName: undefined,
    lastName: undefined,
    orgPermission: {
      permission_id: '',
    },
    phone: undefined,
    phoneId: undefined,
    userGender: undefined,
  });
});

it('renders jean with organization view correctly | No person', () => {
  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={undefined}
    />,
    {
      initialState,
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: '',
    emailId: '',
    firstName: '',
    lastName: '',
    orgPermission: {
      permission_id: ORG_PERMISSIONS.CONTACT,
    },
    phone: '',
    phoneId: '',
    userGender: null,
  });
});

it('renders jean with organization view correctly | No person and isGroupInvite', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.ADMIN,
  });

  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      isGroupInvite={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={undefined}
    />,
    {
      initialState: {
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
      },
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: '',
    emailId: '',
    firstName: '',
    lastName: '',
    orgPermission: {
      permission_id: ORG_PERMISSIONS.USER,
    },
    phone: '',
    phoneId: '',
    userGender: null,
  });
});

it('renders jean with organization and user radio buttons', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.USER,
  });
  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState: {
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
      },
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: undefined,
    emailId: undefined,
    firstName: undefined,
    lastName: undefined,
    orgPermission: {
      permission_id: '',
    },
    phone: undefined,
    phoneId: undefined,
    userGender: undefined,
  });
});

it('renders jean with organization and user and admin radio buttons', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.ADMIN,
  });
  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState: {
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
      },
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: undefined,
    emailId: undefined,
    firstName: undefined,
    lastName: undefined,
    orgPermission: {
      permission_id: '',
    },
    phone: undefined,
    phoneId: undefined,
    userGender: undefined,
  });
});

it('renders jean invite with organization and user and admin radio buttons', () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.ADMIN,
  });
  const { snapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      isGroupInvite={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState: {
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
      },
    },
  );
  snapshot();
  expect(onUpdateData).toHaveBeenCalledWith({
    email: undefined,
    emailId: undefined,
    firstName: undefined,
    lastName: undefined,
    orgPermission: {
      permission_id: '',
    },
    phone: undefined,
    phoneId: undefined,
    userGender: undefined,
  });
});

it('updates org permission', async () => {
  ((orgPermissionSelector as unknown) as jest.Mock).mockReturnValue({
    permission_id: ORG_PERMISSIONS.ADMIN,
  });
  const { getByTestId, recordSnapshot, diffSnapshot } = renderWithContext(
    <AddContactFields
      isJean={true}
      organization={{ id: '1' }}
      onUpdateData={onUpdateData}
      person={{ email_addresses: [], phone_numbers: [] }}
    />,
    {
      initialState: {
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
      },
    },
  );
  recordSnapshot();
  await fireEvent(getByTestId('userRadioButton'), 'onSelect');
  diffSnapshot();
  expect(onUpdateData).toHaveBeenCalled();
});

describe('calls methods', () => {
  it('calls update firstName and changeFocusedField', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={{ email_addresses: [], phone_numbers: [] }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('firstNameInput'), 'onFocus');
    await fireEvent.changeText(getByTestId('firstNameInput'), 'Christian');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: 'Christian',
      lastName: undefined,
    });
  });

  it('calls update lastName and changeFocusedField', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        organization={null}
        onUpdateData={onUpdateData}
        person={{ email_addresses: [], phone_numbers: [] }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('lastNameInput'), 'onFocus');
    await fireEvent.changeText(getByTestId('lastNameInput'), 'Huffman');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      firstName: undefined,
      lastName: 'Huffman',
    });
  });

  it('calls update email', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        isJean={true}
        organization={null}
        onUpdateData={onUpdateData}
        person={{ email_addresses: [], phone_numbers: [] }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent.changeText(getByTestId('emailInput'), 'test123@fake.com');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      email: 'test123@fake.com',
      emailId: undefined,
      firstName: undefined,
      lastName: undefined,
      orgPermission: {
        permission_id: '',
      },
      phone: undefined,
      phoneId: undefined,
      userGender: undefined,
    });
  });

  it('calls update phone', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        isJean={true}
        organization={null}
        onUpdateData={onUpdateData}
        person={{ email_addresses: [], phone_numbers: [] }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent.changeText(getByTestId('phoneInput'), '5555555555');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      email: undefined,
      emailId: undefined,
      firstName: undefined,
      lastName: undefined,
      orgPermission: {
        permission_id: '',
      },
      phone: '5555555555',
      phoneId: undefined,
      userGender: undefined,
    });
  });

  it('calls update gender male', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        isJean={true}
        organization={null}
        onUpdateData={onUpdateData}
        person={{ email_addresses: [], phone_numbers: [] }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('maleGenderButton'), 'onSelect');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      email: undefined,
      emailId: undefined,
      firstName: undefined,
      lastName: undefined,
      orgPermission: {
        permission_id: '',
      },
      phone: undefined,
      phoneId: undefined,
      userGender: 'Male',
    });
  });

  it('calls update gender female', async () => {
    const { recordSnapshot, diffSnapshot, getByTestId } = renderWithContext(
      <AddContactFields
        isJean={true}
        organization={null}
        onUpdateData={onUpdateData}
        person={{ email_addresses: [], phone_numbers: [] }}
      />,
      {
        initialState,
      },
    );
    recordSnapshot();
    await fireEvent(getByTestId('femaleGenderButton'), 'onSelect');
    diffSnapshot();
    expect(onUpdateData).toHaveBeenLastCalledWith({
      email: undefined,
      emailId: undefined,
      firstName: undefined,
      lastName: undefined,
      orgPermission: {
        permission_id: '',
      },
      phone: undefined,
      phoneId: undefined,
      userGender: 'Female',
    });
  });
});
