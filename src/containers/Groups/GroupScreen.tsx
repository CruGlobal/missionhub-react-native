import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux-legacy';
import i18next from 'i18next';

import Header from '../../components/Header/index';
import { navigatePush, navigateToMainTabs } from '../../actions/navigation';
import { refreshCommunity } from '../../actions/organizations';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ImpactView from '../ImpactView';
import IconButton from '../../components/IconButton';
import { ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW } from '../../routes/constants';
import { organizationSelector } from '../../selectors/organizations';
import { buildTrackingObj, disableBack } from '../../utils/common';
import { GLOBAL_COMMUNITY_ID, GROUPS_TAB } from '../../constants';
import theme from '../../theme';

import GroupCelebrate from './GroupCelebrate';
import Members from './Members';
import Contacts from './Contacts';
import Surveys from './Surveys';
import GroupChallenges from './GroupChallenges';
import { GROUP_PROFILE } from './GroupProfile';
import { TestUseCollapsibleHeader } from '../../components/CollapsibleTabHeader/useCollapsibleHeader';
import { CollapsibleTabContent } from '../../components/CollapsibleTabHeader/CollapsibleTabHeader';

class GroupScreen extends Component {
  componentDidMount() {
    disableBack.add();

    // @ts-ignore
    const { dispatch, orgId } = this.props;
    dispatch(refreshCommunity(orgId));
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleAddContact = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;

    dispatch(
      navigatePush(ADD_PERSON_THEN_COMMUNITY_MEMBERS_FLOW, {
        organization: organization.id ? organization : undefined,
      }),
    );
  };

  handleProfile = () => {
    // @ts-ignore
    const { dispatch, organization } = this.props;

    dispatch(navigatePush(GROUP_PROFILE, { organization }));
  };

  back = () => {
    // @ts-ignore
    this.props.dispatch(navigateToMainTabs(GROUPS_TAB));
  };

  renderAddContactIcon() {
    // @ts-ignore
    const { organization } = this.props;

    if (organization.id === GLOBAL_COMMUNITY_ID) {
      return null;
    }

    return !organization.user_created ? (
      <IconButton
        name="addContactIcon"
        type="MissionHub"
        size={24}
        onPress={this.handleAddContact}
      />
    ) : (
      <IconButton
        name="moreIcon"
        type="MissionHub"
        onPress={this.handleProfile}
      />
    );
  }

  render() {
    // @ts-ignore
    const { organization } = this.props;

    return (
      <View style={{ backgroundColor: theme.primaryColor }}>
        <Header
          left={
            <IconButton
              name="homeIcon"
              type="MissionHub"
              size={24}
              onPress={this.back}
            />
          }
          title={organization.name}
          right={this.renderAddContactIcon()}
        />
      </View>
    );
  }
}

const mapStateToProps = (
  // @ts-ignore
  { organizations },
  {
    navigation: {
      state: {
        // @ts-ignore
        params: { orgId, initialTab },
      },
    },
  },
) => ({
  orgId,
  organization: organizationSelector({ organizations }, { orgId }),
  initialTab,
});

export const ConnectedGroupScreen = connect(mapStateToProps)(GroupScreen);

const GROUP_CELEBRATE = 'nav/GROUP_CELEBRATE';
export const GROUP_CHALLENGES = 'nav/GROUP_CHALLENGES';
export const GROUP_MEMBERS = 'nav/GROUP_MEMBERS';
const GROUP_IMPACT = 'nav/GROUP_IMPACT';
const GROUP_CONTACTS = 'nav/GROUP_CONTACTS';
const GROUP_SURVEYS = 'nav/GROUP_SURVEYS';

export const CRU_TABS = [
  {
    name: i18next.t('groupTabs:celebrate'),
    navigationAction: GROUP_CELEBRATE,
    component: ({
      navigation: {
        state: {
          // @ts-ignore
          params: { orgId },
        },
      },
    }) => (
      <CollapsibleTabContent>
        <GroupCelebrate orgId={orgId} />
      </CollapsibleTabContent>
    ),
  },
  {
    name: i18next.t('groupTabs:challenges'),
    navigationAction: GROUP_CHALLENGES,
    component: ({
      navigation: {
        state: {
          // @ts-ignore
          params: { orgId },
        },
      },
    }) => (
      <CollapsibleTabContent>
        <GroupChallenges orgId={orgId} />
      </CollapsibleTabContent>
    ),
  },
  {
    name: i18next.t('groupTabs:members'),
    navigationAction: GROUP_MEMBERS,
    component: ({
      navigation: {
        state: {
          // @ts-ignore
          params: { orgId },
        },
      },
    }) =>
      (
        <CollapsibleTabContent>
          <ImpactView orgId={orgId} />
          <ImpactView orgId={orgId} />
        </CollapsibleTabContent>
      ) || (
        <CollapsibleTabContent>
          <Members orgId={orgId} />
        </CollapsibleTabContent>
      ),
  },
  {
    name: i18next.t('groupTabs:impact'),
    navigationAction: GROUP_IMPACT,
    component: ({
      navigation: {
        state: {
          // @ts-ignore
          params: { orgId },
        },
      },
    }) => (
      <CollapsibleTabContent>
        <ImpactView orgId={orgId} />
        <ImpactView orgId={orgId} />
      </CollapsibleTabContent>
    ),
  },
  {
    name: i18next.t('groupTabs:contacts'),
    navigationAction: GROUP_CONTACTS,
    component: ({
      navigation: {
        state: {
          // @ts-ignore
          params: { orgId },
        },
      },
    }) => (
      <CollapsibleTabContent>
        <Contacts orgId={orgId} />
      </CollapsibleTabContent>
    ),
  },
  {
    name: i18next.t('groupTabs:surveys'),
    navigationAction: GROUP_SURVEYS,
    component: ({
      navigation: {
        state: {
          // @ts-ignore
          params: { orgId },
        },
      },
    }) => (
      <CollapsibleTabContent>
        <Surveys orgId={orgId} />
      </CollapsibleTabContent>
    ),
  },
];
export const USER_CREATED_TABS = CRU_TABS.slice(0, 4);
export const GLOBAL_TABS = [CRU_TABS[0], CRU_TABS[1], CRU_TABS[3]];

// @ts-ignore
export const groupScreenTabNavigator = generateSwipeTabMenuNavigator(
  CRU_TABS,
  ConnectedGroupScreen,
);
// @ts-ignore
export const userCreatedScreenTabNavigator = generateSwipeTabMenuNavigator(
  USER_CREATED_TABS,
  ConnectedGroupScreen,
);
// @ts-ignore
export const globalScreenTabNavigator = generateSwipeTabMenuNavigator(
  GLOBAL_TABS,
  ConnectedGroupScreen,
);

export const GROUP_SCREEN = 'nav/GROUP_SCREEN';
export const USER_CREATED_GROUP_SCREEN = 'nav/USER_CREATED_GROUP_SCREEN';
export const GLOBAL_GROUP_SCREEN = 'nav/GLOBAL_GROUP_SCREEN';

// @ts-ignore
export function getScreenForOrg(orgId, isUserCreated) {
  return orgId === GLOBAL_COMMUNITY_ID
    ? GLOBAL_GROUP_SCREEN
    : isUserCreated
    ? USER_CREATED_GROUP_SCREEN
    : GROUP_SCREEN;
}

export const GROUP_TABS = {
  [GROUP_CELEBRATE]: {
    // @ts-ignore
    tracking: buildTrackingObj(
      'communities : celebration',
      'communities',
      'celebration',
    ),
  },
  [GROUP_CHALLENGES]: {
    // @ts-ignore
    tracking: buildTrackingObj(
      'communities : challenges',
      'communities',
      'challenges',
    ),
  },
  [GROUP_MEMBERS]: {
    // @ts-ignore
    tracking: buildTrackingObj(
      'communities : members',
      'communities',
      'members',
    ),
  },
  [GROUP_IMPACT]: {
    // @ts-ignore
    tracking: buildTrackingObj(
      'communities : our impact',
      'communities',
      'our impact',
    ),
  },
  [GROUP_CONTACTS]: {
    // @ts-ignore
    tracking: buildTrackingObj(
      'communities : contacts',
      'communities',
      'contacts',
    ),
  },
  [GROUP_SURVEYS]: {
    // @ts-ignore
    tracking: buildTrackingObj(
      'communities : surveys',
      'communities',
      'surveys',
    ),
  },
};
