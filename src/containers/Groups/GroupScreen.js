import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

import Header from '../Header/index';
import BackButton from '../BackButton/index';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import ImpactView from '../ImpactView';
import IconButton from '../../components/IconButton';
import { ADD_CONTACT_SCREEN } from '../AddContactScreen';
import { buildTrackingObj } from '../../utils/common';
import { getOrganizationMembers } from '../../actions/organizations';

import GroupCelebrate from './GroupCelebrate';
import Members from './Members';
import Contacts from './Contacts';
import Surveys from './Surveys';

@connect()
export class GroupScreen extends Component {
  handleAddContact = () => {
    const { dispatch } = this.props;
    const { organization } = this.props.navigation.state.params || {};

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

  renderAddContactIcon() {
    return (
      <IconButton
        name="addContactIcon"
        type="MissionHub"
        size={24}
        onPress={this.handleAddContact}
      />
    );
  }

  render() {
    const { organization } = this.props.navigation.state.params || {};
    return (
      <Header
        left={<BackButton />}
        shadow={false}
        title={organization.name}
        right={this.renderAddContactIcon()}
      />
    );
  }
}

const GROUP_CELEBRATE = 'nav/GROUP_CELEBRATE';
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

export const groupScreenTabNavigator = generateSwipeTabMenuNavigator(
  tabs,
  GroupScreen,
);

export const GROUP_SCREEN = 'nav/GROUP_SCREEN';

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
