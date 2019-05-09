import React from 'react';

import { GroupScreen, CRU_TABS, USER_CREATED_TABS } from '../GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  createThunkStore,
  renderShallow,
} from '../../../../testUtils';
import { GLOBAL_COMMUNITY_ID, GROUPS_TAB } from '../../../constants';
import * as common from '../../../utils/common';
import { ADD_CONTACT_SCREEN } from '../../AddContactScreen';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { GROUP_PROFILE } from '../GroupProfile';

jest.mock('../../../actions/navigation');

const organization = { id: '5', name: 'Test  Org', user_created: false };
const userOrg = { ...organization, user_created: true };

navigatePush.mockReturnValue({ type: 'navigate push' });
navigateToMainTabs.mockReturnValue({ type: 'navigateToMainTabs' });

describe('GroupScreen', () => {
  const createHeader = org => (
    <GroupScreen
      navigation={createMockNavState({
        organization: org,
      })}
    />
  );

  it('should render header correctly for global community', () => {
    testSnapshotShallow(
      createHeader({
        id: GLOBAL_COMMUNITY_ID,
        name: 'MissionHub Community',
        community: true,
        user_created: true,
      }),
    );
  });

  it('should render header correctly', () => {
    testSnapshotShallow(createHeader(organization));
  });

  it('should render header correctly for user_created org', () => {
    testSnapshotShallow(createHeader(userOrg));
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
        store={createThunkStore()}
      />,
    ).instance();

    instance.handleAddContact();

    expect(navigatePush).toHaveBeenCalledWith(ADD_CONTACT_SCREEN, {
      onComplete: expect.anything(),
      organization,
    });
  });

  it('should handle profile button correctly', () => {
    const instance = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization: userOrg,
        })}
        store={createThunkStore()}
      />,
    ).instance();

    instance.handleProfile();

    expect(navigatePush).toHaveBeenCalledWith(GROUP_PROFILE, {
      organization: userOrg,
    });
  });

  it('should handle go back correctly', () => {
    const component = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createThunkStore()}
      />,
    );

    component.props().left.props.onPress();

    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
  });

  it('calls disable back add', () => {
    const instance = renderShallow(
      <GroupScreen
        navigation={createMockNavState({
          organization,
        })}
        store={createThunkStore()}
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
        store={createThunkStore()}
      />,
    ).instance();

    common.disableBack = { remove: jest.fn() };
    instance.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});
