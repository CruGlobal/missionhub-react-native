import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DrawerActions } from 'react-navigation';
import i18next from 'i18next';

import Header from '../Header';
import BackButton from '../BackButton';
import ImpactView from '../ImpactView';
import Celebrate from '../Groups/Celebrate';
import Members from '../Groups/Members';
import Contacts from '../Groups/Contacts';
import Surveys from '../Groups/Surveys';
import { Flex, IconButton, Text } from '../../components/common';
import { CONTACT_MENU_DRAWER } from '../../constants';
import { generateSwipeTabMenuNavigator } from '../../components/SwipeTabMenu/index';

import styles from './styles';

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
    }) => <Celebrate organization={organization} />,
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

@connect()
export class PersonScreen extends Component {
  openDrawer = () => {
    this.props.dispatch(
      DrawerActions.openDrawer({
        drawer: CONTACT_MENU_DRAWER,
        isCurrentUser: false,
      }),
    );
  };

  render() {
    const { person, organization } = this.props.navigation.state.params;

    return (
      <View style={{ flex: 1 }}>
        <Header
          left={<BackButton />}
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={this.openDrawer}
            />
          }
          shadow={false}
          title={organization.name}
        />
        <Flex
          value={1}
          style={styles.wrap}
          direction="column"
          align="center"
          justify="center"
          self="stretch"
        >
          <Text style={styles.name}>
            {(person.first_name || '').toUpperCase()}
          </Text>
        </Flex>
      </View>
    );
  }
}

PersonScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export const personScreenTabNavigator = generateSwipeTabMenuNavigator(
  tabs,
  PersonScreen,
);

export const PERSON_SCREEN = 'nav/PERSON';
