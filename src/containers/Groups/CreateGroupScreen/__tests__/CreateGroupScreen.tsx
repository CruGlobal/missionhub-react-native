import React from 'react';
import { Keyboard } from 'react-native';
import { fireEvent } from 'react-native-testing-library';

import { renderWithContext } from '../../../../../testUtils';
import {
  navigateBack,
  navigateToMainTabs,
  navigateNestedReset,
} from '../../../../actions/navigation';
import { addNewOrganization } from '../../../../actions/organizations';
import { trackActionWithoutData } from '../../../../actions/analytics';
import * as organizations from '../../../../actions/organizations';
import { organizationSelector } from '../../../../selectors/organizations';
import { ACTIONS, COMMUNITIES_TAB, MAIN_TABS } from '../../../../constants';
import { COMMUNITY_TABS } from '../../../Communities/Community/constants';
import { COMMUNITY_MEMBERS } from '../../../Communities/Community/CommunityMembers/CommunityMembers';
import CreateGroupScreen from '..';

const mockNewId = '123';
const mockAddNewOrg = {
  type: 'add new organization',
  response: { id: mockNewId },
};

jest.spyOn(Keyboard, 'dismiss');

jest.mock('../../../../actions/analytics', () => ({
  trackScreenChange: jest.fn(() => ({ type: 'trackScreenChange' })),
  trackActionWithoutData: jest.fn(() => ({ type: 'trackActionWithoutData' })),
}));
jest.mock('../../../../actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'back' })),
  navigateNestedReset: jest.fn(() => ({ type: 'navigateNestedReset' })),
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

const initialState = {
  organizations: { all: [] },
  onboarding: {},
  drawer: {},
};

describe('CreateGroupScreen', () => {
  it('renders correctly', () => {
    renderWithContext(<CreateGroupScreen navigation={{ state: {} }} />, {
      initialState,
    }).snapshot();
  });

  it('should update the state', () => {
    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    const name = 'New Community name';

    fireEvent.changeText(getByTestId('communityName'), name);

    expect(getByTestId('communityName').props.value).toEqual(name);
  });

  it('should disable the button when creating a community', () => {
    const { recordSnapshot, getByTestId, diffSnapshot } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    recordSnapshot();
    fireEvent.changeText(getByTestId('communityName'), 'Test');
    fireEvent.press(getByTestId('createCommunityButton'));

    diffSnapshot();
  });

  it('should update the image', () => {
    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    const data = { uri: 'testuri' };
    fireEvent(getByTestId('createCommunityImagePicker'), 'onSelectImage', data);

    expect(getByTestId('createCommunityImageDisplay').props.source).toEqual(
      data,
    );
  });

  it('should call navigate back', () => {
    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    fireEvent.press(getByTestId('backButton'));

    expect(navigateBack).toHaveBeenCalled();
  });

  it('should not call create community without name', () => {
    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    fireEvent.press(getByTestId('createCommunityButton'));

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).not.toHaveBeenCalled();
  });

  it('should call create community without org added to redux', async () => {
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue(undefined);

    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    const name = 'Test';

    fireEvent.changeText(getByTestId('communityName'), name);
    await fireEvent.press(getByTestId('createCommunityButton'));

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, null);
    expect(navigateToMainTabs).toHaveBeenCalledWith(COMMUNITIES_TAB);
  });

  it('should call create community with org added to redux', async () => {
    const org = { id: mockNewId };
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue(org);

    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    const name = 'Test';

    fireEvent.changeText(getByTestId('communityName'), name);
    await fireEvent.press(getByTestId('createCommunityButton'));

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, null);
    expect(navigateNestedReset).toHaveBeenCalledWith([
      { routeName: MAIN_TABS, tabName: COMMUNITIES_TAB },
      {
        routeName: COMMUNITY_TABS,
        params: {
          communityId: mockNewId,
        },
      },
      {
        routeName: COMMUNITY_MEMBERS,
        params: {
          communityId: mockNewId,
        },
      },
    ]);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_CREATED_COMMUNITY,
    );
  });

  it('should call create community with org added to redux and image passed in', async () => {
    const org = { id: mockNewId };
    ((organizationSelector as unknown) as jest.Mock).mockReturnValue(org);

    const { getByTestId } = renderWithContext(
      <CreateGroupScreen navigation={{ state: {} }} />,
      {
        initialState,
      },
    );

    const name = 'Test';
    const data = { uri: 'testuri' };

    fireEvent.changeText(getByTestId('communityName'), name);
    fireEvent(getByTestId('createCommunityImagePicker'), 'onSelectImage', data);
    await fireEvent.press(getByTestId('createCommunityButton'));

    expect(Keyboard.dismiss).toHaveBeenCalled();
    expect(addNewOrganization).toHaveBeenCalledWith(name, data);
    expect(navigateNestedReset).toHaveBeenCalledWith([
      { routeName: MAIN_TABS, tabName: COMMUNITIES_TAB },
      {
        routeName: COMMUNITY_TABS,
        params: {
          communityId: mockNewId,
        },
      },
      {
        routeName: COMMUNITY_MEMBERS,
        params: {
          communityId: mockNewId,
        },
      },
    ]);
    expect(trackActionWithoutData).toHaveBeenCalledWith(
      ACTIONS.SELECT_CREATED_COMMUNITY,
    );
  });
});
