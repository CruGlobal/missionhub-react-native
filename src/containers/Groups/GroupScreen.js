import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18next from 'i18next';

import Header from '../Header/index';
import BackButton from '../BackButton/index';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';
import { navigateBack } from '../../actions/navigation';
// import { MAIN_TABS } from '../../constants';
import ImpactView from '../ImpactView';

import Celebrate from './Celebrate';
import Members from './Members';
import Contacts from './Contacts';
import Surveys from './Surveys';

@connect()
export class GroupScreen extends Component {
  customNavigate = () => {
    const { dispatch } = this.props;
    dispatch(navigateBack());
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
    component: Celebrate,
  },
  {
    name: i18next.t('groupTabs:members'),
    navigationAction: 'nav/GROUP_MEMBERS',
    component: Members,
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
    component: Contacts,
  },
  {
    name: i18next.t('groupTabs:surveys'),
    navigationAction: 'nav/GROUP_SURVEYS',
    component: Surveys,
  },
];

export const groupScreenTabNavigator = generateSwipeTabMenuNavigator(
  tabs,
  GroupScreen,
);

export const GROUP_SCREEN = 'nav/GROUP_SCREEN';
