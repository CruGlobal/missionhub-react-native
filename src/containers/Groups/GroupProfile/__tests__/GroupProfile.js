/* eslint max-lines: 0 */

import React from 'react';
import { Alert } from 'react-native';
import i18next from 'i18next';
import Config from 'react-native-config';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
  createThunkStore,
} from '../../../../../testUtils';
import {
  navigateBack,
  navigateToMainTabs,
} from '../../../../actions/navigation';
import {
  updateOrganization,
  updateOrganizationImage,
  deleteOrganization,
  generateNewCode,
  generateNewLink,
} from '../../../../actions/organizations';
import { trackActionWithoutData } from '../../../../actions/analytics';
import { organizationSelector } from '../../../../selectors/organizations';
import { ORG_PERMISSIONS, ACTIONS, GROUPS_TAB } from '../../../../constants';
import * as common from '../../../../utils/common';

import GroupProfile from '..';

jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigateToMainTabs: jest.fn(() => ({ type: 'navigateToMainTabs' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  updateOrganization: jest.fn(() => ({ type: 'update org' })),
  updateOrganizationImage: jest.fn(() => ({ type: 'update org image' })),
  deleteOrganization: jest.fn(() => ({ type: 'delete org' })),
  generateNewCode: jest.fn(() => ({ type: 'new code' })),
  generateNewLink: jest.fn(() => ({ type: 'new link' })),
}));
jest.mock('../../../../actions/analytics', () => ({
  trackActionWithoutData: jest.fn(() => ({ type: 'Track Action' })),
}));
jest.mock('../../../../selectors/organizations');

Alert.alert = jest.fn();

const orgId = '123';
const organization = {
  id: orgId,
  community_code: '333333',
  community_url: 'abc123',
  name: 'Test Organization',
  created_at: '2018-11-06T12:00:00Z',
  contactReport: { memberCount: 3 },
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
const store = createThunkStore(storeObj);

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
    const store2 = createThunkStore({
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

  describe('edit screen', () => {
    let component;

    beforeEach(() => {
      component = buildScreen();
      // Press the "Edit" button
      component
        .childAt(0)
        .childAt(0)
        .props()
        .right.props.onPress();
      component.update();
    });

    it('renders editing state', () => {
      expect(trackActionWithoutData).toHaveBeenCalledWith(
        ACTIONS.COMMUNITY_EDIT,
      );
      expect(component.instance().state).toEqual({
        editing: true,
        name: organization.name,
        imageData: null,
      });
      expect(component).toMatchSnapshot();
    });

    it('handle image change', () => {
      const data = { uri: 'testuri' };
      component
        .childAt(1)
        .childAt(0)
        .props()
        .onSelectImage(data);

      expect(component.instance().state.imageData).toBe(data);
    });

    it('handle name change', () => {
      const text = 'new name';
      component
        .childAt(1)
        .childAt(1)
        .childAt(0)
        .childAt(0)
        .props()
        .onChangeText(text);

      expect(component.instance().state.name).toBe(text);
    });

    it('handle new code', () => {
      component
        .childAt(1)
        .childAt(1)
        .childAt(4)
        .childAt(1)
        .props()
        .onPress();

      expect(Alert.alert).toHaveBeenCalled();
      //Manually call onPress
      Alert.alert.mock.calls[0][2][1].onPress();

      expect(generateNewCode).toHaveBeenCalledWith(orgId);
    });

    it('handle new link', () => {
      component
        .childAt(1)
        .childAt(1)
        .childAt(6)
        .childAt(1)
        .props()
        .onPress();

      expect(Alert.alert).toHaveBeenCalled();
      //Manually call onPress
      Alert.alert.mock.calls[0][2][1].onPress();

      expect(generateNewLink).toHaveBeenCalledWith(orgId);
    });

    it('handles delete organization', async () => {
      component
        .childAt(1)
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

      await Alert.alert.mock.calls[0][2][1].onPress();

      expect(deleteOrganization).toHaveBeenCalledWith(orgId);
      expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
    });
  });

  it('handle copy code', () => {
    const component = buildScreen();
    component
      .childAt(1)
      .childAt(1)
      .childAt(4)
      .childAt(1)
      .props()
      .onPress();

    expect(trackActionWithoutData).toHaveBeenCalledWith(ACTIONS.COPY_CODE);
    expect(common.copyText).toHaveBeenCalledWith(
      i18next.t('groupProfile:codeCopyText', {
        code: organization.community_code,
      }),
    );
  });

  it('handle copy link', () => {
    const component = buildScreen();
    component
      .childAt(1)
      .childAt(1)
      .childAt(6)
      .childAt(1)
      .props()
      .onPress();

    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.COPY_INVITE_URL,
    );
    expect(common.copyText).toHaveBeenCalledWith(
      i18next.t('groupsMembers:sendInviteMessage', {
        url: `${Config.COMMUNITY_URL}${organization.community_url}`,
        code: organization.community_code,
      }),
    );
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
    //expect(updateOrganizationImage).toHaveBeenCalledWith(orgId, data); todo need to wait for name update to finish
  });
});
