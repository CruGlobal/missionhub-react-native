import { createDrawerNavigator } from 'react-navigation';

import { buildTrackingObj, isAndroid } from '../../utils/common';
import PersonSideMenu from '../../components/PersonSideMenu';
import { UNASSIGNED_PERSON_SCREEN } from '../../containers/Groups/UnassignedPersonScreen';
import UnassignedPersonScreen from '../../containers/Groups/UnassignedPersonScreen';
import {
  CONTACT_PERSON_SCREEN,
  ContactPersonScreen,
  IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
  IS_GROUPS_MEMBER_PERSON_SCREEN,
  IS_USER_CREATED_MEMBER_PERSON_SCREEN,
  IsGroupsMeCommunityPersonScreen,
  IsGroupsMemberPersonScreen,
  IsUserCreatedMemberPersonScreen,
  ME_COMMUNITY_PERSON_SCREEN,
  ME_PERSONAL_PERSON_SCREEN,
  MeCommunityPersonScreen,
  MEMBER_PERSON_SCREEN,
  MemberPersonScreen,
  MePersonalPersonScreen,
} from '../../containers/Groups/AssignedPersonScreen';

const buildPersonScreenRoute = screen => ({
  screen: createDrawerNavigator(
    {
      Main: { screen },
    },
    {
      contentComponent: PersonSideMenu,
      drawerPosition: 'right',
      navigationOptions: { drawerLockMode: 'locked-closed' },
      backBehavior: 'none', // We're handling it on our own
    },
  ),
  tracking: buildTrackingObj(['person']),
  navigationOptions: { gesturesEnabled: isAndroid ? false : true },
});

export const personScreens = {
  [UNASSIGNED_PERSON_SCREEN]: {
    screen: UnassignedPersonScreen,
    tracking: buildTrackingObj(['person'], 'unassigned'),
    navigationOptions: { gesturesEnabled: true },
  },
  [CONTACT_PERSON_SCREEN]: buildPersonScreenRoute(ContactPersonScreen),
  [IS_USER_CREATED_MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(
    IsUserCreatedMemberPersonScreen,
  ),
  [IS_GROUPS_MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(
    IsGroupsMemberPersonScreen,
  ),
  [MEMBER_PERSON_SCREEN]: buildPersonScreenRoute(MemberPersonScreen),
  [ME_PERSONAL_PERSON_SCREEN]: buildPersonScreenRoute(MePersonalPersonScreen),
  [IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoute(
    IsGroupsMeCommunityPersonScreen,
  ),
  [ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoute(MeCommunityPersonScreen),
};
