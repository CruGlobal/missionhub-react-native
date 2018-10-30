import React from 'react';

import {
  GroupScreen,
  CRU_TABS,
  USER_CREATED_TABS,
} from '../../../src/containers/Groups/GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  createMockStore,
  renderShallow,
} from '../../../testUtils';
import { ADD_CONTACT_SCREEN } from '../../../src/containers/AddContactScreen';
import { navigatePush, navigateReset } from '../../../src/actions/navigation';
import { MAIN_TABS } from '../../../src/constants';
import * as common from '../../../src/utils/common';

jest.mock('../../../src/actions/navigation', () => ({
  navigateBack: jest.fn(() => ({ type: 'test' })),
  navigatePush: jest.fn(),
  navigateReset: jest.fn(),
}));

const organization = { id: '5', name: 'Test  Org', user_created: false };

describe('GroupScreen', () => {
  const createHeader = org => (
    <GroupScreen
      navigation={createMockNavState({
        organization: org,
      })}
    />
  );

  it('should render header correctly', () => {
    testSnapshotShallow(createHeader(organization));
  });

  it('should render header correctly for user_created org', () => {
    testSnapshotShallow(createHeader({ ...organization, user_created: true }));
  });

  it('should render Cru Community tabs correctly', () => {
    expect(CRU_TABS).toMatchSnapshot();
  });

  it('should render User Created Community tabs correctly', () => {
    expect(USER_CREATED_TABS).toMatchSnapshot();
  });

  it('should handle add contact button correctly', () => {
    const instance = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createMockStore()}
      />,
    ).instance();

    instance.handleAddContact();

    expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
      onComplete: expect.anything(),
      organization,
    });
  });

  it('should handle go back correctly', () => {
    const component = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createMockStore()}
      />,
    );

    component.props().left.props.onPress();

    expect(navigateReset).toHaveBeenCalledWith(MAIN_TABS, {
      startTab: 'groups',
    });
  });

  it('calls disable back add', () => {
    const instance = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createMockStore()}
      />,
    ).instance();

    common.disableBack = { add: jest.fn() };
    instance.componentDidMount();
    expect(common.disableBack.add).toHaveBeenCalledTimes(1);
  });

  it('calls disable back remove', () => {
    const instance = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createMockStore()}
      />,
    ).instance();

    common.disableBack = { remove: jest.fn() };
    instance.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});
