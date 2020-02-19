/* eslint max-lines: 0 */

import React, { useState, useEffect } from 'react';
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
import { getPersonDetails } from '../../../actions/person';
import { updateAnalyticsContext } from '../../../actions/analytics';
import { navigateBack } from '../../../actions/navigation';
import PathwayStageDisplay from '../../PathwayStageDisplay';
import { orgIsCru } from '../../../utils/common';
import theme from '../../../theme';
import { Person, PeopleState } from '../../../reducers/people';
import {
  Organization,
  OrganizationsState,
} from '../../../reducers/organizations';
import { AuthState } from '../../../reducers/auth';
import { StagesState } from '../../../reducers/stages';
import { useKeyboardListeners } from '../../../utils/hooks/useKeyboardListeners';

import styles from './styles';

const PERSON_STEPS = 'nav/PERSON_STEPS';
const PERSON_NOTES = 'nav/PERSON_NOTES';
const PERSON_JOURNEY = 'nav/PERSON_JOURNEY';
const MEMBER_IMPACT = 'nav/MEMBER_IMPACT';
const MEMBER_CELEBRATE = 'nav/MEMBER_CELEBRATE';
const MEMBERS_ASSIGNED_CONTACTS = 'nav/MEMBER_ASSIGNED_CONTACTS';
export const ALL_PERSON_TAB_ROUTES = {
  [PERSON_STEPS]: {},
  [PERSON_NOTES]: {},
  [PERSON_JOURNEY]: {},
  [MEMBER_IMPACT]: {},
  [MEMBER_CELEBRATE]: {},
  [MEMBERS_ASSIGNED_CONTACTS]: {},
};

const personSteps = {
  name: i18next.t('personTabs:steps'),
  navigationAction: PERSON_STEPS,
  component: ({
    navigation: {
      state: {
        // @ts-ignore
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
        // @ts-ignore
        params: { organization, person },
      },
    },
    // @ts-ignore
  }) => <ContactNotes organization={organization} person={person} />,
};
const personJourney = {
  name: i18next.t('personTabs:ourJourney'),
  navigationAction: PERSON_JOURNEY,
  component: ({
    navigation: {
      state: {
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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
        // @ts-ignore
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

interface AssignedPersonScreenProps {
  person: Person;
  organization: Organization;
  myId: string;
  isCommunityMember: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contactAssignment: any;
  myStageId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stages: any;
  isCruOrg: boolean;
}

export const AssignedPersonScreen = ({
  person,
  organization,
  myId,
  isCommunityMember,
  contactAssignment,
  myStageId,
  stages,
  isCruOrg,
}: AssignedPersonScreenProps) => {
  const dispatch = useDispatch();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    dispatch(getPersonDetails(person.id, organization.id));
    dispatch(
      updateAnalyticsContext({
        'cru.assignment-type':
          person.id === myId
            ? 'self'
            : isCommunityMember
            ? 'community member'
            : 'contact',
      }),
    );
  }, []);

  const keyboardShow = () => {
    setKeyboardVisible(true);
  };

  const keyboardHide = () => {
    setKeyboardVisible(false);
  };

  useKeyboardListeners({ onShow: keyboardShow, onHide: keyboardHide });

  const handleBack = () => {
    dispatch(updateAnalyticsContext({ 'cru.assignment-type': '' }));
    dispatch(navigateBack());
  };

  const openDrawer = () => {
    dispatch(DrawerActions.openDrawer({ drawer: PERSON_MENU_DRAWER }));
  };

  // If the keyboard is up, show the person's name and the organization
  const name = person.first_name || '';

  return (
    <View style={styles.container}>
      <StatusBar {...theme.statusBar.lightContent} />
      <Header
        left={<BackButton customNavigate={handleBack} />}
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
          // @ts-ignore
          isVisible={!keyboardVisible}
          isMember={isCommunityMember}
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
        params: { person: navPerson, organization: navOrg },
      },
    },
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
) => {
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

  const orgPermission = orgPermissionSelector(
    { organizations },
    { person, organization },
  );

  return {
    contactAssignment,
    person,
    organization,
    stages: stages.stages,
    myId: authPerson.id,
    myStageId: authPerson.user.pathway_stage_id,
    isCruOrg: orgIsCru(organization),
    isCommunityMember: !!orgPermission,
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
// @ts-ignore
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
