import React from 'react';

import GroupProfile from '..';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
  createMockStore,
} from '../../../../../testUtils';
import { navigateBack } from '../../../../actions/navigation';
import { updateOrganization } from '../../../../actions/organizations';
import { organizationSelector } from '../../../../selectors/organizations';
import { ORG_PERMISSIONS } from '../../../../constants';
import * as common from '../../../../utils/common';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  updateOrganization: jest.fn(() => ({ type: 'update org' })),
  getMyCommunities: jest.fn(() => ({ type: 'get my communities' })),
}));
jest.mock('../../../../selectors/organizations');

const orgId = '123';
const organization = {
  id: orgId,
  name: 'Test Organization',
  created_at: '2018-11-06T12:00:00Z',
  members: [
    {
      id: '1',
      full_name: 'Test Admin 1',
      organizational_permissions: [
        {
          id: 'orgPerm1',
          organization_id: orgId,
          permission_id: ORG_PERMISSIONS.ADMIN,
        },
      ],
    },
    {
      id: '2',
      full_name: 'Test User 2',
      organizational_permissions: [
        {
          id: 'orgPerm2',
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
const store = createMockStore({
  organizations: {
    all: [organization],
  },
});

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

  it('renders editing state', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component
      .childAt(2)
      .childAt(1)
      .childAt(0)
      .props()
      .onPress();

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

  it('handle new code', () => {
    const component = buildScreen();
    // Press the "Edit" button
    component.instance().handleEdit();
    component.update();
    const result = component
      .childAt(1)
      .childAt(4)
      .childAt(1)
      .props()
      .onPress();

    expect(result).toBe('new code');
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
    // Could not get this to grab the right props from the <IconButton> component
    // const component = buildScreen();
    // component
    //   .childAt(2)
    //   .childAt(0)
    //   .childAt(1)
    //   .props()
    //   .onPress();

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

    expect(updateOrganization).toHaveBeenCalledWith(orgId, {
      name,
      imageData: null,
    });
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

    expect(updateOrganization).toHaveBeenCalledWith(orgId, {
      name: undefined,
      imageData: data,
    });
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

    expect(updateOrganization).toHaveBeenCalledWith(orgId, {
      name,
      imageData: data,
    });
  });
});
