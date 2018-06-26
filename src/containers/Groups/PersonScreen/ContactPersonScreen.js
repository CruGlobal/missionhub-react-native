import React, { Component } from 'react';
import { View } from 'react-native';
import i18next from 'i18next';
import { connect } from 'react-redux';
import { DrawerActions } from 'react-navigation';
import PropTypes from 'prop-types';

import Header from '../../Header';
import BackButton from '../../BackButton';
import MemberCelebrate from '../../MemberCelebrate';
import ContactSteps from '../../ContactSteps';
import ContactNotes from '../../ContactNotes';
import ContactJourney from '../../ContactJourney';
import ImpactView from '../../ImpactView';
import MemberContacts from '../../MemberContacts';
import { generateSwipeTabMenuNavigator } from '../../../components/SwipeTabMenu/index';
import { Flex, IconButton, Text } from '../../../components/common';

import styles from './styles';

const CONTACT_PERSON_TABS = [
  {
    name: i18next.t('personTabs:steps'),
    navigationAction: 'nav/PERSON_STEPS',
    component: ({
      navigation: {
        state: {
          params: { organization, person },
        },
      },
    }) => <ContactSteps organization={organization} person={person} />,
  },
  {
    name: i18next.t('personTabs:notes'),
    navigationAction: 'nav/PERSON_NOTES',
    component: ({
      navigation: {
        state: {
          params: { organization, person },
        },
      },
    }) => <ContactNotes organization={organization} person={person} />,
  },
  {
    name: i18next.t('personTabs:journey'),
    navigationAction: 'nav/PERSON_JOURNEY',
    component: ({
      navigation: {
        state: {
          params: { organization, person },
        },
      },
    }) => <ContactJourney organization={organization} person={person} />,
  },
];

@connect()
export class ContactPersonScreen extends Component {
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
      <View>
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
          style={styles.wrap}
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

ContactPersonScreen.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
  }).isRequired,
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export const connectedPersonScreen = connect(mapStateToProps)(
  ContactPersonScreen,
);

export default generateSwipeTabMenuNavigator(
  CONTACT_PERSON_TABS,
  connectedPersonScreen,
);

export const CONTACT_PERSON_SCREEN = 'nav/CONTACT_PERSON';
