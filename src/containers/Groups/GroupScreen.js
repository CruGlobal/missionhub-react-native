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

import GroupCelebrate from './GroupCelebrate';
import Members from './Members';
import Contacts from './Contacts';
import Surveys from './Surveys';

@connect()
export class GroupScreen extends Component {
  handleAddContact = () => {
    const { dispatch } = this.props;
    const { organization } = this.props.navigation.state.params || {};
    const onComplete = this.props.onComplete
      ? this.props.onComplete
      : () => {
          // You go through 4 screens for adding a person, so pop back to the first one
          dispatch(navigateBack(4));
        };

    dispatch(
      navigatePush(ADD_CONTACT_SCREEN, {
        organization: organization.id ? organization : undefined,
        onComplete,
      }),
    );
  };

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
}

const tabs = [
  {
    name: i18next.t('groupTabs:celebrate'),
    navigationAction: 'nav/GROUP_CELEBRATE',
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
    navigationAction: 'nav/GROUP_MEMBERS',
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
    navigationAction: 'nav/GROUP_IMPACT',
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
    navigationAction: 'nav/GROUP_CONTACTS',
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
    navigationAction: 'nav/GROUP_SURVEYS',
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
