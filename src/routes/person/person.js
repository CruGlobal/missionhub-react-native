import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

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
import { StepsTabScreens } from '../mainTabs/stepsTab';
import { STAGE_SCREEN } from '../../containers/StageScreen';
import StageScreen from '../../containers/StageScreen';
import { STAGE_SUCCESS_SCREEN } from '../../containers/StageSuccessScreen';
import { SELECT_STEP_SCREEN } from '../../containers/SelectStepScreen';
import { wrapNextScreenFn } from '../helpers';

const buildPersonScreenRoutes = (screenName, screen) =>
  createDrawerNavigator(
    {
      Main: createStackNavigator(
        {
          [screenName]: { screen },
          [STAGE_SCREEN]: {
            screen: wrapNextScreenFn(StageScreen, ({ isMe }) => {
              debugger;
            }),
            tracking: buildTrackingObj(['person'], 'choose stage'),
          },
        },
        {
          navigationOptions: {
            header: null,
          },
        },
      ),
    },
    {
      contentComponent: PersonSideMenu,
      drawerPosition: 'right',
      navigationOptions: { drawerLockMode: 'locked-closed' },
      backBehavior: 'none', // We're handling it on our own
    },
  );
// tracking: buildTrackingObj(['person']),
// navigationOptions: { gesturesEnabled: !isAndroid },
// });

export const personScreens = {
  [UNASSIGNED_PERSON_SCREEN]: {
    screen: UnassignedPersonScreen,
    tracking: buildTrackingObj(['person'], 'unassigned'),
    navigationOptions: { gesturesEnabled: true },
  },
  [CONTACT_PERSON_SCREEN]: buildPersonScreenRoutes(
    CONTACT_PERSON_SCREEN,
    ContactPersonScreen,
  ),
  [IS_USER_CREATED_MEMBER_PERSON_SCREEN]: buildPersonScreenRoutes(
    IS_USER_CREATED_MEMBER_PERSON_SCREEN,
    IsUserCreatedMemberPersonScreen,
  ),
  [IS_GROUPS_MEMBER_PERSON_SCREEN]: buildPersonScreenRoutes(
    IS_GROUPS_MEMBER_PERSON_SCREEN,
    IsGroupsMemberPersonScreen,
  ),
  [MEMBER_PERSON_SCREEN]: buildPersonScreenRoutes(
    MEMBER_PERSON_SCREEN,
    MemberPersonScreen,
  ),
  [ME_PERSONAL_PERSON_SCREEN]: buildPersonScreenRoutes(
    ME_PERSONAL_PERSON_SCREEN,
    MePersonalPersonScreen,
  ),
  [IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoutes(
    IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN,
    IsGroupsMeCommunityPersonScreen,
  ),
  [ME_COMMUNITY_PERSON_SCREEN]: buildPersonScreenRoutes(
    ME_COMMUNITY_PERSON_SCREEN,
    MeCommunityPersonScreen,
  ),
};
