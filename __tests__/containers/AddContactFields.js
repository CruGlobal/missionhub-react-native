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

orgPermissionSelector.mockReturnValue(orgPermission);

const store = createMockStore();
function buildScreen(props) {
  return renderShallow(
    <AddContactFields onUpdateData={() => {}} {...props} />,
    store,
  );
}

it('renders casey view correctly', () => {
  testSnapshotShallow(
    <AddContactFields
      onUpdateData={() => {}}
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
      onUpdateData={() => {}}
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
      onUpdateData={() => {}}
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
      onUpdateData={() => {}}
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
      onUpdateData={() => {}}
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
