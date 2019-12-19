/* eslint max-lines: 0 */

import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import i18next from 'i18next';
import { connect } from 'react-redux-legacy';
import { DrawerActions } from 'react-navigation-drawer';
import PropTypes from 'prop-types';

import Header from '../../../components/Header';
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
import {
  keyboardShow,
  keyboardHide,
  buildTrackingObj,
  orgIsCru,
} from '../../../utils/common';
import theme from '../../../theme';

import styles from './styles';

const PERSON_STEPS = 'nav/PERSON_STEPS';
const PERSON_NOTES = 'nav/PERSON_NOTES';
const PERSON_JOURNEY = 'nav/PERSON_JOURNEY';
const MEMBER_IMPACT = 'nav/MEMBER_IMPACT';
const MEMBER_CELEBRATE = 'nav/MEMBER_CELEBRATE';
const MEMBERS_ASSIGNED_CONTACTS = 'nav/MEMBER_ASSIGNED_CONTACTS';
export const ALL_PERSON_TAB_ROUTES = {
  [PERSON_STEPS]: {
    tracking: buildTrackingObj('person : steps', 'person'),
  },
  [PERSON_NOTES]: {
    tracking: buildTrackingObj('person : notes', 'person'),
  },
  [PERSON_JOURNEY]: {
    tracking: buildTrackingObj('person : journey', 'person'),
  },
  [MEMBER_IMPACT]: {
    tracking: buildTrackingObj('person : impact', 'person'),
  },
  [MEMBER_CELEBRATE]: {
    tracking: buildTrackingObj('person : celebrate', 'person'),
  },
  [MEMBERS_ASSIGNED_CONTACTS]: {
    tracking: buildTrackingObj('person : assigned contacts', 'person'),
  },
};

const personSteps = {
  name: i18next.t('personTabs:steps'),
  navigationAction: PERSON_STEPS,
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
  navigationAction: PERSON_NOTES,
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
  navigationAction: PERSON_JOURNEY,
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ContactJourney organization={organization} person={person} />,
};
const memberImpact = {
  name: i18next.t('personTabs:impact'),
  navigationAction: MEMBER_IMPACT,
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ImpactView orgId={organization.id} person={person} />,
};
const memberCelebrate = {
  name: i18next.t('personTabs:celebrate'),
  navigationAction: MEMBER_CELEBRATE,
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
  navigationAction: MEMBERS_ASSIGNED_CONTACTS,
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
  navigationAction: PERSON_JOURNEY,
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
  navigationAction: MEMBER_IMPACT,
  component: ({
    navigation: {
      state: {
        params: { organization, person },
      },
    },
  }) => <ImpactView orgId={organization.id} person={person} />,
};

export const CONTACT_PERSON_TABS = [personSteps, personNotes, personJourney];
export const IS_USER_CREATED_MEMBER_PERSON_TABS = [
  memberCelebrate,
  memberImpact,
];
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

export class AssignedPersonScreen extends Component {
  state = { keyboardVisible: false };

  componentDidMount() {
    const { person, organization = {} } = this.props;
    this.props.dispatch(getPersonDetails(person.id, organization.id));

    this.keyboardShowListener = keyboardShow(this.keyboardShow);
    this.keyboardHideListener = keyboardHide(this.keyboardHide);
  }

  componentWillUnmount() {
    this.keyboardShowListener.remove();
    this.keyboardHideListener.remove();
  }

  keyboardShow = () => {
    this.setState({ keyboardVisible: true });
  };

  keyboardHide = () => {
    this.setState({ keyboardVisible: false });
  };

  openDrawer = () => {
    this.props.dispatch(
      DrawerActions.openDrawer({ drawer: PERSON_MENU_DRAWER }),
    );
  };

  render() {
    const { keyboardVisible } = this.state;
    const {
      dispatch,
      person,
      organization,
      isMember,
      contactAssignment,
      myId,
      myStageId,
      stages,
      isCruOrg,
    } = this.props;

    // If the keyboard is up, show the person's name and the organization
    const name = person.first_name || '';

    return (
      <View style={styles.container}>
        <StatusBar {...theme.statusBar.lightContent} />
        <Header
          left={<BackButton />}
          right={
            <IconButton
              name="moreIcon"
              type="MissionHub"
              onPress={this.openDrawer}
            />
          }
          title={keyboardVisible ? name : organization.name}
          title2={keyboardVisible ? organization.name : undefined}
        />
        <Flex
          style={[
            styles.wrap,
            // Hide this whole section when the keyboard is up
            keyboardVisible ? { height: 0, paddingVertical: 0 } : undefined,
          ]}
          align="center"
          justify="center"
          self="stretch"
        >
          <Text style={styles.name}>{name}</Text>
          {isCruOrg ? (
            <PathwayStageDisplay orgId={organization.id} person={person} />
          ) : null}
          <GroupsPersonHeader
            isVisible={!keyboardVisible}
            isMember={isMember}
            contactAssignment={contactAssignment}
            person={person}
            dispatch={dispatch}
            organization={organization}
            myId={myId}
            myStageId={myStageId}
            stages={stages}
            isCruOrg={isCruOrg}
          />
        </Flex>
      </View>
    );
  }
}

AssignedPersonScreen.propTypes = {
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
  const navParams = navigation.state.params || {};
  const { person: navPerson = {}, organization: navOrg = {} } = navParams;
  const orgId = navOrg.id || 'personal';
  const personId = navPerson.id;

  const organization =
    organizationSelector({ organizations }, { orgId }) || navOrg;
  const person = personSelector({ people }, { orgId, personId }) || navPerson;

  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person, orgId: organization.id },
  );
  const authPerson = auth.person;

  return {
    ...navParams,
    contactAssignment,
    person,
    organization,
    stages: stages.stages,
    myId: authPerson.id,
    myStageId: authPerson.user.pathway_stage_id,
    isCruOrg: orgIsCru(organization),
  };
};

const connectedPersonScreen = connect(mapStateToProps)(AssignedPersonScreen);

//TODO find a way to not do this, even if it means switching to a different navigation library...
export const ContactPersonScreen = generateSwipeTabMenuNavigator(
  CONTACT_PERSON_TABS,
  connectedPersonScreen,
  false,
);
export const IsUserCreatedMemberPersonScreen = generateSwipeTabMenuNavigator(
  IS_USER_CREATED_MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
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
export const IS_USER_CREATED_MEMBER_PERSON_SCREEN =
  'nav/IS_USER_CREATED_MEMBER_PERSON';
export const IS_GROUPS_MEMBER_PERSON_SCREEN = 'nav/IS_GROUPS_MEMBER_PERSON';
export const MEMBER_PERSON_SCREEN = 'nav/MEMBER_PERSON';
export const ME_PERSONAL_PERSON_SCREEN = 'nav/ME_PERSONAL_PERSON';
export const IS_GROUPS_ME_COMMUNITY_PERSON_SCREEN =
  'nav/IS_GROUPS_ME_COMMUNITY_PERSON';
export const ME_COMMUNITY_PERSON_SCREEN = 'nav/ME_COMMUNITY_PERSON';
