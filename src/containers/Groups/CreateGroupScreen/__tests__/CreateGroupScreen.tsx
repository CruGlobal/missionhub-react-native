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
import { COMMUNITY_TABS } from '../../../Communities/Community/constants';

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
  // @ts-ignore
  organizations.addNewOrganization.mockImplementation(
    jest.fn(() => mockAddNewOrg),
  );
});

// @ts-ignore
let store;

const state = {
  organizations: { all: [] },
};

// @ts-ignore
trackActionWithoutData.mockReturnValue({ type: 'tracked action without data' });

beforeEach(() => {
  store = createThunkStore(state);
});

// @ts-ignore
function buildScreen(props) {
  return renderShallow(
    <CreateGroupScreen navigation={createMockNavState()} {...props} />,
    // @ts-ignore
    store,
  );
}

// @ts-ignore
function buildScreenInstance(props) {
  return buildScreen(props).instance();
}

describe('CreateGroupScreen', () => {
  it('renders correctly', () => {
    testSnapshotShallow(
      <CreateGroupScreen navigation={createMockNavState()} />,
      // @ts-ignore
      store,
    );
  });

  it('should update the state', () => {
    // @ts-ignore
    const component = buildScreenInstance();

    const name = 'test';
    // @ts-ignore
    component.onChangeText(name);

    // @ts-ignore
    expect(component.state.name).toEqual(name);
  });

  it('should disable the button when creating a community', () => {
    // @ts-ignore
    const component = buildScreen();
    component.setState({ name: 'Test', isCreatingCommunity: true });

    expect(component.update()).toMatchSnapshot();
  });

  it('should update the image', () => {
    // @ts-ignore
    const screen = buildScreen();
    const component = screen.instance();

    const data = { uri: 'testuri' };
    // @ts-ignore
    component.handleImageChange(data);

    // @ts-ignore
    expect(component.state.imageData).toEqual(data);
    expect(screen.update()).toMatchSnapshot();
  });

  it('should call navigate back', () => {
    // @ts-ignore
    const component = buildScreen();
    const backButton = component.childAt(1).props().left;
    backButton.props.onPress();

    expect(navigateBack).toHaveBeenCalled();
  });

  it('should call ref', () => {
    // @ts-ignore
    const instance = buildScreenInstance();
    const ref = 'test';
    // @ts-ignore
    instance.ref(ref);
    // @ts-ignore
    expect(instance.nameInput).toEqual(ref);
  });

  it('should not call create community without name', async () => {
    Keyboard.dismiss = jest.fn();
    // @ts-ignore
    const component = buildScreen();
    const result = await component
      .childAt(3)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(result).toBe(undefined);
  });

  it('should call create community without org added to redux', async () => {
    Keyboard.dismiss = jest.fn();
    // @ts-ignore
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });
    // @ts-ignore
    organizationSelector.mockReturnValue(undefined);

    await component
      .childAt(3)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, null);
    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
  });

  it('should call create community with org added to redux', async () => {
    Keyboard.dismiss = jest.fn();
    // @ts-ignore
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });

    const org = { id: mockNewId };
    // @ts-ignore
    organizationSelector.mockReturnValue(org);

    await component
      .childAt(3)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, null);
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
      communityId: mockNewId,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_CREATED_COMMUNITY,
    );
  });

  it('should call create community with org added to redux and image passed in', async () => {
    Keyboard.dismiss = jest.fn();
    // @ts-ignore
    const component = buildScreen();
    const name = 'Tester';
    component.setState({ name });
    const data = { uri: 'testuri' };
    // @ts-ignore
    component.instance().handleImageChange(data);

    const org = { id: mockNewId };
    // @ts-ignore
    organizationSelector.mockReturnValue(org);

    await component
      .childAt(3)
      .props()
      .onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, data);
    expect(navigatePush).toHaveBeenCalledWith(COMMUNITY_TABS, {
      communityId: mockNewId,
    });
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_CREATED_COMMUNITY,
    );
  });
});
