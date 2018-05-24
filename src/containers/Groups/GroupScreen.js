import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import i18next from 'i18next';

import Header from '../Header/index';
import BackButton from '../BackButton/index';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import { navigateReset } from '../../actions/navigation';
import { MAIN_TABS } from '../../constants';
import ImpactView from '../ImpactView';

@connect()
export class GroupScreenHeader extends Component {
  customNavigate = () => {
    const { dispatch } = this.props;
    dispatch(navigateReset(MAIN_TABS));
  };

  render() {
    const { organization } = this.props.navigation.state.params || {};
    return (
      <Header
        left={<BackButton customNavigate={this.customNavigate} />}
        shadow={false}
        title={organization.name}
      />
    );
  }
}

const tabs = [
  {
    name: i18next.t('groupTabs:celebrate'),
    navigationAction: 'nav/GROUP_CELEBRATE',
    component: () => <Text>Group Celebrate</Text>,
  },
  {
    name: i18next.t('groupTabs:members'),
    navigationAction: 'nav/GROUP_MEMBERS',
    component: () => <Text>Group Members</Text>,
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
    component: () => <Text>Group Contacts</Text>,
  },
  {
    name: i18next.t('groupTabs:surveys'),
    navigationAction: 'nav/GROUP_SURVEYS',
    component: () => <Text>Group Surveys</Text>,
  },
];

export const groupScreenTabNavigator = generateSwipeTabMenuNavigator(
  tabs,
  GroupScreenHeader,
);

export const GROUP_SCREEN = 'nav/GROUP_SCREEN';
