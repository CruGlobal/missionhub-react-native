import React from 'react';

import {
  ConnectedGroupScreen,
  CRU_TABS,
  USER_CREATED_TABS,
} from '../GroupScreen';
import {
  testSnapshotShallow,
  createMockNavState,
  createThunkStore,
  renderShallow,
} from '../../../../testUtils';
import { GLOBAL_COMMUNITY_ID, GROUPS_TAB } from '../../../constants';
import * as common from '../../../utils/common';
import { ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW } from '../../../routes/constants';
import { navigatePush, navigateToMainTabs } from '../../../actions/navigation';
import { GROUP_PROFILE } from '../GroupProfile';

jest.mock('../../../actions/navigation');

const orgId = '5';
const organization = { id: orgId, name: 'Test  Org', user_created: false };
const userOrg = { ...organization, user_created: true };
const globalOrg = {
  id: GLOBAL_COMMUNITY_ID,
  name: 'MissionHub Community',
  community: true,
  user_created: true,
};

// @ts-ignore
navigatePush.mockReturnValue({ type: 'navigate push' });
// @ts-ignore
navigateToMainTabs.mockReturnValue({ type: 'navigateToMainTabs' });

describe('GroupScreen', () => {
  it('should render header correctly for global community', () => {
    testSnapshotShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({ orgId: GLOBAL_COMMUNITY_ID })}
        store={createThunkStore({ organizations: { all: [globalOrg] } })}
      />,
    );
  });

  it('should render header correctly for cru community', () => {
    testSnapshotShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({ orgId })}
        store={createThunkStore({ organizations: { all: [organization] } })}
      />,
    );
  });

  it('should render header correctly for user_created community', () => {
    testSnapshotShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({ orgId })}
        store={createThunkStore({ organizations: { all: [userOrg] } })}
      />,
    );
  });

  it('should render Cru Community tabs correctly', () => {
    expect(CRU_TABS).toMatchSnapshot();
  });

  it('should render User Created Community tabs correctly', () => {
    expect(USER_CREATED_TABS).toMatchSnapshot();
  });

  it('should handle add contact button correctly', () => {
    const component = renderShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({
          orgId,
        })}
        store={createThunkStore({ organizations: { all: [organization] } })}
      />,
    );

    component
      .childAt(0)
      .props()
      .right.props.onPress();

    expect(navigatePush).toHaveBeenCalledWith(
      ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW,
      {
        organization,
      },
    );
  });

  it('should handle profile button correctly', () => {
    const component = renderShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({ orgId })}
        store={createThunkStore({ organizations: { all: [userOrg] } })}
      />,
    );

    component
      .childAt(0)
      .props()
      .right.props.onPress();

    expect(navigatePush).toHaveBeenCalledWith(GROUP_PROFILE, {
      organization: userOrg,
    });
  });

  it('should handle go back correctly', () => {
    const component = renderShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({ orgId })}
        store={createThunkStore({ organizations: { all: [organization] } })}
      />,
    );

    component
      .childAt(0)
      .props()
      .left.props.onPress();

    expect(navigateToMainTabs).toHaveBeenCalledWith(GROUPS_TAB);
  });

  it('calls disable back add', () => {
    const instance = renderShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({
          orgId,
        })}
        store={createThunkStore({ organizations: { all: [organization] } })}
      />,
    ).instance();

    // @ts-ignore
    common.disableBack = { add: jest.fn() };
    // @ts-ignore
    instance.componentDidMount();
    expect(common.disableBack.add).toHaveBeenCalledTimes(1);
  });

  it('calls disable back remove', () => {
    const instance = renderShallow(
      <ConnectedGroupScreen
        // @ts-ignore
        navigation={createMockNavState({
          organization,
        })}
        store={createThunkStore({ organizations: { all: [organization] } })}
      />,
    ).instance();

    // @ts-ignore
    common.disableBack = { remove: jest.fn() };
    // @ts-ignore
    instance.componentWillUnmount();
    expect(common.disableBack.remove).toHaveBeenCalledTimes(1);
  });
});
