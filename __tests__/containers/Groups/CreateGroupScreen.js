import React from 'react';
import { Keyboard } from 'react-native';

import CreateGroupScreen from '../../../src/containers/Groups/CreateGroupScreen';
import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
  createMockStore,
} from '../../../testUtils';
import {
  navigateBack,
  navigateReset,
  navigatePush,
} from '../../../src/actions/navigation';
import {
  getMyCommunities,
  addNewOrganization,
} from '../../../src/actions/organizations';
import * as organizations from '../../../src/actions/organizations';
import { organizationSelector } from '../../../src/selectors/organizations';
import { MAIN_TABS } from '../../../src/constants';
import { USER_CREATED_GROUP_SCREEN } from '../../../src/containers/Groups/GroupScreen';

const mockNewId = '123';
const mockAddNewOrg = {
  type: 'add new organization',
  response: { id: mockNewId },
};

jest.mock('../../../src/actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateReset: jest.fn(() => ({ type: 'reset' })),
}));
jest.mock('../../../src/actions/organizations', () => ({
  addNewOrganization: jest.fn(() => mockAddNewOrg),
  getMyCommunities: jest.fn(() => ({ type: 'get my communities' })),
}));
jest.mock('../../../src/selectors/organizations');

beforeEach(() => {
  jest.clearAllMocks();
  organizations.addNewOrganization.mockImplementation(
    jest.fn(() => mockAddNewOrg),
  );
});

const store = createMockStore({
  organizations: { all: [] },
});

function buildScreen(props) {
  return renderShallow(
    <CreateGroupScreen navigation={createMockNavState()} {...props} />,
    store,
  );
}

function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

describe('CreateGroupScreen', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <CreateGroupScreen navigation={createMockNavState()} />,
      store,
    );
  });

  it('should update the state', () => {
    const component = buildScreenInstance();

    const name = 'test';
    component.onChangeText(name);

    expect(component.state.name).toEqual(name);
  });

  it('should update the image', () => {
    const component = buildScreenInstance();

    const uri = 'testuri';
    component.handleImageChange({ uri });

    expect(component.state.imageUri).toEqual(uri);
    expect(component).toMatchSnapshot();
  });

  it('should call navigate back', () => {
    const component = buildScreen();
    const backButton = component.childAt(0).props().left;
    backButton.props.onPress();

    expect(navigateBack).toHaveBeenCalled();
  });

  it('should call ref', () => {
    const instance = buildScreenInstance();
    const ref = 'test';
    instance.ref(ref);
    expect(instance.nameInput).toEqual(ref);
  });

  it('should not call create community without name', async () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    const result = await component
      .childAt(2)
      .childAt(0)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(result).toBe(undefined);
  });

  it('should call create community without org added to redux', async () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });
    organizationSelector.mockReturnValue(undefined);

    await component
      .childAt(2)
      .childAt(0)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name);
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewOrg);
    expect(getMyCommunities).toHaveBeenCalled();
    expect(navigateReset).toHaveBeenCalledWith(MAIN_TABS, {
      startTab: 'groups',
    });
  });

  it('should call create community with org added to redux', async () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });

    const org = { id: mockNewId };
    organizationSelector.mockReturnValue(org);

    await component
      .childAt(2)
      .childAt(0)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name);
    expect(store.dispatch).toHaveBeenCalledWith(mockAddNewOrg);
    expect(getMyCommunities).toHaveBeenCalled();
    expect(navigatePush).toHaveBeenCalledWith(USER_CREATED_GROUP_SCREEN, {
      organization: org,
    });
  });
});
