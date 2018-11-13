import React from 'react';
import { Alert } from 'react-native';

import GroupProfile from '..';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
  createMockStore,
} from '../../../../../testUtils';
import { navigateBack, navigateReset } from '../../../../actions/navigation';
import {
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  generateNewCode,
  getMyCommunities,
  getOrganizationMembers,
} from '../../../../actions/organizations';
import { organizationSelector } from '../../../../selectors/organizations';
import { ORG_PERMISSIONS, MAIN_TABS } from '../../../../constants';
import * as common from '../../../../utils/common';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  updateOrganization: jest.fn(() => ({ type: 'update org' })),
  updateOrganizationImage: jest.fn(() => ({ type: 'update org image' })),
  getMyCommunities: jest.fn(() => ({ type: 'get my communities' })),
  getOrganizationMembers: jest.fn(() => ({ type: 'get org members' })),
  deleteOrganization: jest.fn(() => ({ type: 'delete org' })),
  generateNewCode: jest.fn(() => ({ type: 'new code' })),
}));
jest.mock('../../../../selectors/organizations');

Alert.alert = jest.fn();

const orgId = '123';
const organization = {
  id: orgId,
  community_code: '333333',
  name: 'Test Organization',
  created_at: '2018-11-06T12:00:00Z',
  members: [
    {
      id: '1',
      full_name: 'Test Owner 1',
      organizational_permissions: [
        {
          id: 'orgPerm1',
          organization_id: orgId,
          permission_id: ORG_PERMISSIONS.OWNER,
        },
      ],
    },
    {
      id: '2',
      full_name: 'Test Admin 2',
      organizational_permissions: [
        {
          id: 'orgPerm2',
          organization_id: orgId,
          permission_id: ORG_PERMISSIONS.ADMIN,
        },
      ],
    },
    {
      id: '3',
      full_name: 'Test User 3',
      organizational_permissions: [
        {
          id: 'orgPerm3',
          organization_id: orgId,
          permission_id: ORG_PERMISSIONS.USER,
        },
      ],
    },
  ],
};
const orgWithImage = {
  ...organization,
  community_photo_url:
    'https://vignette.wikia.nocookie.net/edain-mod/images/6/6e/Mordor_Submod_Banner.jpg',
};
const storeObj = {
  organizations: {
    all: [organization],
  },
  auth: {
    person: {
      id: '123',
      organizational_permissions: [
        { organization_id: orgId, permission_id: ORG_PERMISSIONS.OWNER },
      ],
    },
  },
};
const store = createMockStore(storeObj);

common.copyText = jest.fn();
organizationSelector.mockReturnValue(organization);

function buildScreen(props) {
  return renderShallow(
    <GroupProfile
      navigation={createMockNavState({ organization })}
      {...props}
    />,
    store,
  );
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

describe('GroupProfile', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <GroupProfile navigation={createMockNavState({ organization })} />,
      store,
    );
  });

  it('renders with image', () => {
    testSnapshotShallow(
      <GroupProfile
        navigation={createMockNavState({ organization: orgWithImage })}
      />,
      store,
    );
  });

  it('renders without edit button', () => {
    const store2 = createMockStore({
      ...storeObj,
      auth: {
        person: {
          ...storeObj.auth.person,
          organizational_permissions: [
            { organization_id: orgId, permission_id: ORG_PERMISSIONS.USER },
          ],
        },
      },
    });
    testSnapshotShallow(
      <GroupProfile navigation={createMockNavState({ organization })} />,
      store2,
    );
  });

  it('renders editing state', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component
      .childAt(2)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();
    component.update();

    expect(component.instance().state).toEqual({
      editing: true,
      name: organization.name,
      imageData: null,
    });
    expect(component).toMatchSnapshot();
  });

  it('handle image change', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const data = { uri: 'testuri' };
    component
      .childAt(0)
      .props()
      .onSelectImage(data);

    expect(component.instance().state.imageData).toBe(data);
  });

  it('handle name change', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const text = 'new name';
    component
      .childAt(1)
      .childAt(0)
      .childAt(0)
      .props()
      .onChangeText(text);

    expect(component.instance().state.name).toBe(text);
  });

  it('handle new code', async () => {
    const component = buildScreen();
    const instance = component.instance();
    // Press the "Edit" button
    instance.reloadOrgs = jest.fn();
    instance.handleEdit();
    component.update();
    instance.handleEdit = jest.fn();
    await component
      .childAt(1)
      .childAt(4)
      .childAt(1)
      .props()
      .onPress();

    expect(generateNewCode).toHaveBeenCalledWith(orgId);
    expect(instance.reloadOrgs).toHaveBeenCalled();
    expect(instance.handleEdit).toHaveBeenCalled();
  });

  it('handle new link', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const result = component
      .childAt(1)
      .childAt(6)
      .childAt(1)
      .props()
      .onPress();

    expect(result).toBe('new link');
  });

  it('handle copy code', () => {
    const component = buildScreen();
    component
      .childAt(1)
      .childAt(4)
      .childAt(1)
      .props()
      .onPress();

    expect(common.copyText).toHaveBeenCalled();
  });

  it('handle copy link', () => {
    const component = buildScreen();
    component
      .childAt(1)
      .childAt(6)
      .childAt(1)
      .props()
      .onPress();

    expect(common.copyText).toHaveBeenCalled();
  });

  it('handle navigate back', () => {
    const instance = buildScreenInstance();
    instance.navigateBack();

    expect(navigateBack).toHaveBeenCalled();
  });

  it('calls save', () => {
    const component = buildScreen();
    component.instance().save = jest.fn();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    // Press the "Done" button
    component.instance().handleEdit();

    expect(component.instance().save).toHaveBeenCalled();
  });

  it('handles save with name change', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const name = 'new name';
    component.instance().handleChangeName(name);
    component.update();
    // Press the "Done" button
    component.instance().handleEdit();

    expect(updateOrganization).toHaveBeenCalledWith(orgId, { name });
  });

  it('handles save with image change', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const data = { uri: 'testuri' };
    component.instance().handleImageChange(data);
    component.update();
    // Press the "Done" button
    component.instance().handleEdit();

    expect(updateOrganizationImage).toHaveBeenCalledWith(orgId, data);
  });

  it('handles save with image and name change', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const data = { uri: 'testuri' };
    component.instance().handleImageChange(data);
    component.update();
    const name = 'new name';
    component.instance().handleChangeName(name);
    component.update();
    // Press the "Done" button
    component.instance().handleEdit();

    expect(updateOrganization).toHaveBeenCalledWith(orgId, { name });
    expect(updateOrganizationImage).toHaveBeenCalledWith(orgId, data);
  });

  it('handles reloading an organization with members', async () => {
    const component = buildScreen();
    await component.instance().reloadOrgs();

    expect(getMyCommunities).toHaveBeenCalledWith();
    expect(getOrganizationMembers).toHaveBeenCalledWith(orgId);
  });

  it('handles delete organization', () => {
    const component = buildScreen();

    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();

    component
      .childAt(1)
      .childAt(0)
      .childAt(1)
      .props()
      .actions[0].onPress();

    expect(Alert.alert).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      [
        {
          text: expect.any(String),
          style: 'cancel',
        },
        {
          text: expect.any(String),
          style: 'destructive',
          onPress: expect.any(Function),
        },
      ],
    );
  });

  it('handles delete organization', async () => {
    const instance = buildScreenInstance();

    await instance.deleteOrg();
    expect(deleteOrganization).toHaveBeenCalledWith(orgId);
    expect(navigateReset).toHaveBeenCalledWith(MAIN_TABS, {
      startTab: 'groups',
    });
  });
});
