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
import { PERSON_MENU_DRAWER } from '../../../constants';
import { generateSwipeTabMenuNavigator } from '../../../components/SwipeTabMenu/index';
import { Flex, IconButton, Text } from '../../../components/common';
import {
  contactAssignmentSelector,
  personSelector,
} from '../../../selectors/people';
import GroupsPersonHeader from '../../../components/GroupsPersonHeader/index';

import styles from './styles';

export const CONTACT_PERSON_TABS = [
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

export const MEMBER_PERSON_TABS = [
  {
    name: i18next.t('personTabs:celebrate'),
    navigationAction: 'nav/MEMBER_CELEBRATE',
    component: ({
      navigation: {
        state: {
          params: { organization, person },
        },
      },
    }) => <MemberCelebrate organization={organization} person={person} />,
  },
  ...CONTACT_PERSON_TABS,
  {
    name: i18next.t('personTabs:Impact'),
    navigationAction: 'nav/MEMBER_IMPACT',
    component: ({
      navigation: {
        state: {
          params: { organization, person },
        },
      },
    }) => <ImpactView organization={organization} person={person} />,
  },
  {
    name: i18next.t('personTabs:assignedContacts'),
    navigationAction: 'nav/MEMBER_ASSIGNED_CONTACTS',
    component: ({
      navigation: {
        state: {
          params: { organization, person },
        },
      },
    }) => <MemberContacts organization={organization} person={person} />,
  },
];

export class PersonScreen extends Component {
  render() {
    const {
      dispatch,
      person,
      organization,
      isMember,
      contactAssignment,
      pathwayStage,
      myId,
      myStageId,
      stages,
    } = this.props;

    return (
      <View>
        <Header
          left={<BackButton />}
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={() =>
                dispatch(
                  DrawerActions.openDrawer({
                    drawer: PERSON_MENU_DRAWER,
                  }),
                )
              }
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
          {pathwayStage ? (
            <Text style={styles.stage}>{pathwayStage.name}</Text>
          ) : null}
          <GroupsPersonHeader
            isMember={isMember}
            contactAssignment={contactAssignment}
            person={person}
            dispatch={dispatch}
            organization={organization}
            myId={myId}
            myStageId={myStageId}
            stages={stages}
          />
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

export const mapStateToProps = ({ people, auth, stages }, { navigation }) => {
  const navParams = navigation.state.params;
  const orgId = navParams.organization && navParams.organization.id;
  const person =
    personSelector({ people }, { personId: navParams.person.id, orgId }) ||
    navParams.person;
  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person, orgId },
  );
  const stagesList = stages.stages;
  const authPerson = auth.person;

  return {
    ...(navigation.state.params || {}),
    contactAssignment,
    person,
    pathwayStage:
      contactAssignment &&
      stagesList.find(s => s.id === `${contactAssignment.pathway_stage_id}`),
    stages: stagesList,
    myId: authPerson.id,
    myStageId: authPerson.user.pathway_stage_id,
  };
};

const connectedPersonScreen = connect(mapStateToProps)(PersonScreen);

export const ContactPersonScreen = generateSwipeTabMenuNavigator(
  CONTACT_PERSON_TABS,
  connectedPersonScreen,
  false,
);
export const MemberPersonScreen = generateSwipeTabMenuNavigator(
  MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
);

export const CONTACT_PERSON_SCREEN = 'nav/CONTACT_PERSON';
export const MEMBER_PERSON_SCREEN = 'nav/MEMBER_PERSON';
