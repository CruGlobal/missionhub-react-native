import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

import Header from '../Header/index';
import {
  navigatePush,
  navigateBack,
  navigateReset,
} from '../../actions/navigation';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ImpactView from '../ImpactView';
import IconButton from '../../components/IconButton';
import { ADD_CONTACT_SCREEN } from '../AddContactScreen';
import { buildTrackingObj, disableBack } from '../../utils/common';
import { getOrganizationMembers } from '../../actions/organizations';
import { MAIN_TABS } from '../../constants';

import GroupCelebrate from './GroupCelebrate';
import Members from './Members';
import Contacts from './Contacts';
import Surveys from './Surveys';
import GroupChallenges from './GroupChallenges';

@connect()
export class GroupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organization: props.navigation.state.params.organization || {},
    };
  }

  componentDidMount() {
    disableBack.add();
  }

  componentWillUnmount() {
    disableBack.remove();
  }

  handleAddContact = () => {
    const { dispatch } = this.props;
    const { organization } = this.state;

    dispatch(
      navigatePush(ADD_CONTACT_SCREEN, {
        organization: organization.id ? organization : undefined,
        onComplete: () => {
          // You go through 4 screens for adding a person, so pop back to the first one
          dispatch(navigateBack(4));
          // refresh the members list after creating a new person
          if (organization.id) {
            dispatch(getOrganizationMembers(organization.id));
          }
        },
      }),
    );
  };

  back = () => {
    this.props.dispatch(navigateReset(MAIN_TABS, { startTab: 'groups' }));
  };

  renderAddContactIcon() {
    const { organization } = this.state;
    return !organization.user_created ? (
      <IconButton
        name="addContactIcon"
        type="MissionHub"
        size={24}
        onPress={this.handleAddContact}
      />
    ) : null;
  }

  render() {
    const { organization } = this.state;
    return (
      <Header
        left={
          <IconButton
            name="homeIcon"
            type="MissionHub"
            size={24}
            onPress={this.back}
          />
        }
        shadow={false}
        title={organization.name}
        right={this.renderAddContactIcon()}
      />
    );
  }
}

const GROUP_CELEBRATE = 'nav/GROUP_CELEBRATE';
const GROUP_CHALLENGES = 'nav/GROUP_CHALLENGES';
const GROUP_MEMBERS = 'nav/GROUP_MEMBERS';
const GROUP_IMPACT = 'nav/GROUP_IMPACT';
const GROUP_CONTACTS = 'nav/GROUP_CONTACTS';
const GROUP_SURVEYS = 'nav/GROUP_SURVEYS';

const tabs = [
  {
    name: i18next.t('groupTabs:celebrate'),
    navigationAction: GROUP_CELEBRATE,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <GroupCelebrate organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:challenges'),
    navigationAction: GROUP_CHALLENGES,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <GroupChallenges organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:members'),
    navigationAction: GROUP_MEMBERS,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <Members organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:impact'),
    navigationAction: GROUP_IMPACT,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <ImpactView organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:contacts'),
    navigationAction: GROUP_CONTACTS,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <Contacts organization={organization} />,
  },
  {
    name: i18next.t('groupTabs:surveys'),
    navigationAction: GROUP_SURVEYS,
    component: ({
      navigation: {
        state: {
          params: { organization },
        },
      },
    }) => <Surveys organization={organization} />,
  },
];

export const CRU_TABS = [tabs[0], ...tabs.slice(2, 6)];
export const USER_CREATED_TABS = tabs.slice(0, 4);

export const groupScreenTabNavigator = generateSwipeTabMenuNavigator(
  CRU_TABS,
  GroupScreen,
);
export const userCreatedScreenTabNavigator = generateSwipeTabMenuNavigator(
  USER_CREATED_TABS,
  GroupScreen,
);

export const GROUP_SCREEN = 'nav/GROUP_SCREEN';
export const USER_CREATED_GROUP_SCREEN = 'nav/USER_CREATED_GROUP_SCREEN';

export const GROUP_TABS = {
  [GROUP_CELEBRATE]: {
    tracking: buildTrackingObj(
      'communities : group : celebrate',
      'communities',
      'community',
    ),
  },
  [GROUP_MEMBERS]: {
    tracking: buildTrackingObj(
      'communities : group : members',
      'communities',
      'community',
    ),
  },
  [GROUP_IMPACT]: {
    tracking: buildTrackingObj(
      'communities : group : impact',
      'communities',
      'community',
    ),
  },
  [GROUP_CONTACTS]: {
    tracking: buildTrackingObj(
      'communities : group : contacts',
      'communities',
      'community',
    ),
  },
  [GROUP_SURVEYS]: {
    tracking: buildTrackingObj(
      'communities : group : surveys',
      'communities',
      'community',
    ),
  },
};
