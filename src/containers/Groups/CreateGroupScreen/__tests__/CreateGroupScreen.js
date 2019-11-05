import React from 'react';
import { Keyboard } from 'react-native';

import {
  renderShallow,
  createMockNavState,
  testSnapshotShallow,
  createThunkStore,
} from '../../../../../testUtils';
import {
  navigateBack,
  navigatePush,
  navigateToMainTabs,
} from '../../../../actions/navigation';
import { addNewOrganization } from '../../../../actions/organizations';
import { trackActionWithoutData } from '../../../../actions/analytics';
import * as organizations from '../../../../actions/organizations';
import { organizationSelector } from '../../../../selectors/organizations';
import { ACTIONS, GROUPS_TAB } from '../../../../constants';
import { USER_CREATED_GROUP_SCREEN, GROUP_MEMBERS } from '../../GroupScreen';

import CreateGroupScreen from '..';

const mockNewId = '123';
const mockAddNewOrg = {
  type: 'add new organization',
  response: { id: mockNewId },
};

jest.mock('../../../../actions/analytics');
jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigatePush: jest.fn(() => ({ type: 'push' })),
  navigateToMainTabs: jest.fn(() => ({ type: 'navigateToMainTabs' })),
}));
jest.mock('../../../../actions/organizations', () => ({
  addNewOrganization: jest.fn(() => mockAddNewOrg),
}));
jest.mock('../../../../selectors/organizations');

beforeEach(() => {
  organizations.addNewOrganization.mockImplementation(
    jest.fn(() => mockAddNewOrg),
  );
});

let store;

const state = {
  organizations: { all: [] },
};

trackActionWithoutData.mockReturnValue({ type: 'tracked action without data' });

beforeEach(() => {
  store = createThunkStore(state);
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

  it('should disable the button when creating a community', () => {
    const component = buildScreen();
    component.setState({ name: 'Test', isCreatingCommunity: true });

    expect(component.update()).toMatchSnapshot();
  });

  it('should update the image', () => {
    const screen = buildScreen();
    const component = screen.instance();

    const data = { uri: 'testuri' };
    component.handleImageChange(data);

    expect(component.state.imageData).toEqual(data);
    expect(screen.update()).toMatchSnapshot();
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
      .childAt(1)
      .childAt(1)
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
      .childAt(1)
      .childAt(1)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, null);
    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
  });

  it('should call create community with org added to redux', async () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });

    const org = { id: mockNewId };
    organizationSelector.mockReturnValue(org);

    await component
      .childAt(1)
      .childAt(1)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, null);
    expect(navigatePush).toHaveBeenCalledWith(USER_CREATED_GROUP_SCREEN, {
      orgId: mockNewId,
      initialTab: GROUP_MEMBERS,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_CREATED_COMMUNITY,
    );
  });

  it('should call create community with org added to redux and image passed in', async () => {
    Keyboard.dismiss = jest.fn();
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });
    const data = { uri: 'testuri' };
    component.instance().handleImageChange(data);

    const org = { id: mockNewId };
    organizationSelector.mockReturnValue(org);

    await component
      .childAt(1)
      .childAt(1)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, data);
    expect(navigatePush).toHaveBeenCalledWith(USER_CREATED_GROUP_SCREEN, {
      orgId: mockNewId,
      initialTab: GROUP_MEMBERS,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_CREATED_COMMUNITY,
    );
  });
});
