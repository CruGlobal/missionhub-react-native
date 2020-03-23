/* eslint max-lines: 0 */

import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import i18next from 'i18next';
import { connect, useDispatch } from 'react-redux-legacy';
import { DrawerActions } from 'react-navigation-drawer';

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
  orgPermissionSelector,
} from '../../../selectors/people';
import GroupsPersonHeader from '../../../components/GroupsPersonHeader/index';
import { organizationSelector } from '../../../selectors/organizations';
import PathwayStageDisplay from '../../PathwayStageDisplay';
import {
  buildTrackingObj,
  orgIsCru,
  hasOrgPermissions,
} from '../../../utils/common';
import { useKeyboardListeners } from '../../../utils/hooks/useKeyboardListeners';
import { Person, PeopleState } from '../../../reducers/people';
import { Stage, StagesState } from '../../../reducers/stages';
import { AuthState } from '../../../reducers/auth';
import {
  Organization,
  OrganizationsState,
} from '../../../reducers/organizations';
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
    // @ts-ignore
    tracking: buildTrackingObj('person : steps', 'person'),
  },
  [PERSON_NOTES]: {
    // @ts-ignore
    tracking: buildTrackingObj('person : notes', 'person'),
  },
  [PERSON_JOURNEY]: {
    // @ts-ignore
    tracking: buildTrackingObj('person : journey', 'person'),
  },
  [MEMBER_IMPACT]: {
    // @ts-ignore
    tracking: buildTrackingObj('person : impact', 'person'),
  },
  [MEMBER_CELEBRATE]: {
    // @ts-ignore
    tracking: buildTrackingObj('person : celebrate', 'person'),
  },
  [MEMBERS_ASSIGNED_CONTACTS]: {
    // @ts-ignore
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
  }) => <ContactSteps organization={organization} person={person} />,
};
const personNotes = {
  name: i18next.t('personTabs:notes'),
  navigationAction: PERSON_NOTES,
  component: ({
    navigation: {
      state: {
        params: { person },
      },
    },
  }: {
    navigation: {
      state: { params: { person: Person } };
    };
  }) => <ContactNotes person={person} />,
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
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
  }: {
    navigation: {
      state: { params: { organization: Organization; person: Person } };
    };
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

interface AssignedPersonScreenProps {
  person: Person;
  organization: Organization;
  contactAssignment: { id: string };
  orgPermission: { id: string };
  stages: Stage[];
  myId: string;
  myStageId: string;
}

export const AssignedPersonScreen = ({
  person,
  organization,
  contactAssignment,
  orgPermission,
  stages,
  myId,
  myStageId,
}: AssignedPersonScreenProps) => {
  const dispatch = useDispatch();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  useKeyboardListeners({
    onShow: () => setKeyboardVisible(true),
    onHide: () => setKeyboardVisible(false),
  });

  const openDrawer = () => {
    dispatch(DrawerActions.openDrawer({ drawer: PERSON_MENU_DRAWER }));
  };

  // If the keyboard is up, show the person's name and the organization
  const name = person.first_name || '';

  const isCruOrg = orgIsCru(organization);
  const isMember = hasOrgPermissions(orgPermission);

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.lightContent} />
      <Header
        left={<BackButton />}
        right={
          <IconButton name="moreIcon" type="MissionHub" onPress={openDrawer} />
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
};

export const mapStateToProps = (
  {
    people,
    auth,
    stages,
    organizations,
  }: {
    people: PeopleState;
    auth: AuthState;
    stages: StagesState;
    organizations: OrganizationsState;
  },
  {
    navigation: {
      state: {
        params: { person, organization },
      },
    },
  }: {
    navigation: {
      state: { params: { person: Person; organization: Organization } };
    };
  },
) => {
  const orgId = organization.id || 'personal';
  const personId = person.id;

  const selectorOrg =
    organizationSelector({ organizations }, { orgId }) || organization;
  const selectorPerson =
    personSelector({ people }, { orgId, personId }) || person;

  const contactAssignment = contactAssignmentSelector(
    { auth },
    { person, orgId: organization.id },
  );
  const orgPermission = orgPermissionSelector(
    {},
    { person: selectorPerson, organization: selectorOrg },
  );
  const authPerson = auth.person;

  return {
    contactAssignment,
    orgPermission,
    person,
    organization,
    stages: stages.stages,
    myId: authPerson.id,
    myStageId: authPerson.user.pathway_stage_id,
  };
};

const connectedPersonScreen = connect(mapStateToProps)(AssignedPersonScreen);

//TODO find a way to not do this, even if it means switching to a different navigation library...
// @ts-ignore
export const ContactPersonScreen = generateSwipeTabMenuNavigator(
  CONTACT_PERSON_TABS,
  connectedPersonScreen,
  false,
);
// @ts-ignore
export const IsUserCreatedMemberPersonScreen = generateSwipeTabMenuNavigator(
  IS_USER_CREATED_MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
);
// @ts-ignore
export const IsGroupsMemberPersonScreen = generateSwipeTabMenuNavigator(
  IS_GROUPS_MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
);
// @ts-ignore
export const MemberPersonScreen = generateSwipeTabMenuNavigator(
  MEMBER_PERSON_TABS,
  connectedPersonScreen,
  true,
);
// @ts-ignore
export const MePersonalPersonScreen = generateSwipeTabMenuNavigator(
  ME_PERSONAL_TABS,
  connectedPersonScreen,
  false,
);
// @ts-ignore
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
