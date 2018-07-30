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
import { organizationSelector } from '../../../selectors/organizations';
import { getPersonDetails } from '../../../actions/person';
import PathwayStageDisplay from '../../PathwayStageDisplay';

import styles from './styles';

const personSteps = {
  name: i18next.t('personTabs:steps'),
  navigationAction: 'nav/PERSON_STEPS',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ContactSteps organization={organization} person={person} />,
};
const personNotes = {
  name: i18next.t('personTabs:notes'),
  navigationAction: 'nav/PERSON_NOTES',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ContactNotes organization={organization} person={person} />,
};
const personJourney = {
  name: i18next.t('personTabs:ourJourney'),
  navigationAction: 'nav/PERSON_JOURNEY',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ContactJourney organization={organization} person={person} />,
};
const memberImpact = {
  name: i18next.t('personTabs:Impact'),
  navigationAction: 'nav/MEMBER_IMPACT',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ImpactView organization={organization} person={person} />,
};
const memberCelebrate = {
  name: i18next.t('personTabs:celebrate'),
  navigationAction: 'nav/MEMBER_CELEBRATE',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <MemberCelebrate organization={organization} person={person} />,
};
const assignedContacts = {
  name: i18next.t('personTabs:assignedContacts'),
  navigationAction: 'nav/MEMBER_ASSIGNED_CONTACTS',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <MemberContacts organization={organization} person={person} />,
};
const myJourney = {
  name: i18next.t('personTabs:myJourney'),
  navigationAction: 'nav/PERSON_JOURNEY',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ContactJourney organization={organization} person={person} />,
};
const myImpact = {
  name: i18next.t('personTabs:myImpact'),
  navigationAction: 'nav/MEMBER_IMPACT',
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ImpactView organization={organization} person={person} />,
};

export const CONTACT_PERSON_TABS = [personSteps, personNotes, personJourney];
export const IS_GROUPS_MEMBER_PERSON_TABS = [
  memberCelebrate,
  ...CONTACT_PERSON_TABS,
  memberImpact,
  assignedContacts,
];
const MEMBER_PERSON_TABS = [...CONTACT_PERSON_TABS, memberImpact];
const ME_PERSONAL_TABS = [personSteps, personNotes, myJourney, memberImpact];
const IS_GROUPS_ME_COMMUNITY_TABS = [memberCelebrate, myImpact];
const ME_COMMUNITY_TABS = [myImpact];

export class PersonScreen extends Component {
  componentDidMount() {
    const { person, organization = {} } = this.props;
    this.props.dispatch(getPersonDetails(person.id, organization.id));
  }

  render() {
    const {
      dispatch,
      person,
      organization,
      isMember,
      contactAssignment,
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
          <PathwayStageDisplay personId={person.id} orgId={organization.id} />
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
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export const mapStateToProps = (
  { people, auth, stages, organizations },
  { navigation },
) => {
  const {
    person: navPerson,
    organization: navOrganization = {},
  } = navigation.state.params;

  const organization =
    organizationSelector({ organizations }, { orgId: navOrganization.id }) ||
    {}; //TODO Creating a new object every time will cause shallow comparisons to fail and lead to unnecessary re-rendering

  const person =
    personSelector(
      { people },
      { personId: navPerson.id, orgId: organization.id },
    ) || navPerson;

  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person, orgId: organization.id },
  );
  const authPerson = auth.person;

  return {
    ...(navigation.state.params || {}),
    contactAssignment,
    person,
    organization,
    stages: stages.stages,
    myId: authPerson.id,
    myStageId: authPerson.user.pathway_stage_id,
  };
};

const connectedPersonScreen = connect(mapStateToProps)(PersonScreen);

//TODO find a way to not do this, even if it means switching to a different navigation library...
export const ContactPersonScreen = generateSwipeTabMenuNavigator(
  CONTACT_PERSON_TABS,
  connectedPersonScreen,
  false,
);
export const IsGroupsMemberPersonScreen = generateSwipeTabMenuNavigator(
  IS_GROUPS_MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
);
export const MemberPersonScreen = generateSwipeTabMenuNavigator(
  MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
);
export const MePersonalPersonScreen = generateSwipeTabMenuNavigator(
  ME_PERSONAL_TABS,
  connectedPersonScreen,
  false,
);
export const IsGroupsMeCommunityPersonScreen = generateSwipeTabMenuNavigator(
  IS_GROUPS_ME_COMMUNITY_TABS,
  connectedPersonScreen,
  true,
);
export const MeCommunityPersonScreen = generateSwipeTabMenuNavigator(
  ME_COMMUNITY_TABS,
  connectedPersonScreen,
  true,
);

export const CONTACT_PERSON_SCREEN = 'nav/CONTACT_PERSON';
export const IS_GROUPS_MEMBER_PERSON_SCREEN = 'nav/IS_GROUPS_MEMBER_PERSON';
export const MEMBER_PERSON_SCREEN = 'nav/MEMBER_PERSON';
export const ME_PERSONAL_PERSON_SCREEN = 'nav/ME_PERSONAL_PERSON';
export const IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN =
  'nav/IS_GROUPS_ME_COMMUNITY_PERSON';
export const ME_COMMUNITY_PERSON_SCREEN = 'nav/ME_COMMUNITY_PERSON';
