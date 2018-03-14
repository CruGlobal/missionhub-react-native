import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../containers/AddContactScreen';
import { createContactAssignment, deleteContactAssignment, updateFollowupStatus } from '../../actions/person';
import { deleteStep } from '../../actions/steps';
import { contactAssignmentSelector, orgPermissionSelector, personSelector } from '../../selectors/people';
import { DRAWER_CLOSE } from '../../constants';
import { isMissionhubUser } from '../../utils/common';

@translate('contactSideMenu')
export class ContactSideMenu extends Component {

  unassignAction(deleteMode = false) {
    return () => {
      const { t, dispatch, person } = this.props;
      Alert.alert(
        t(deleteMode ? 'deleteQuestion' : 'unassignQuestion', { name: person.first_name }),
        t(deleteMode ? 'deleteSentence' : 'unassignSentence'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t(deleteMode ? 'delete' : 'unassignButton'),
            style: 'destructive',
            onPress: () => {
              this.deleteOnUnmount = true;
              dispatch(navigatePush(DRAWER_CLOSE));
              dispatch(navigateBack()); // Navigate back since the contact is no longer in our list
            },
          },
        ],
      );
    };
  }

  async componentWillUnmount() {
    if (this.deleteOnUnmount) {
      const { dispatch, person, contactAssignment, organization } = this.props;
      await Promise.all(person.received_challenges.map((step) => dispatch(deleteStep(step))));
      await dispatch(deleteContactAssignment(contactAssignment.id, person.id, organization && organization.id));
    }
  }

  render() {
    const { t, dispatch, isJean, personIsCurrentUser, myId, person, orgPermission, contactAssignment, organization } = this.props;

    const showAssign = !personIsCurrentUser && !contactAssignment;
    const showDelete = !personIsCurrentUser && contactAssignment && (!isJean || !orgPermission);
    const showUnassign = !personIsCurrentUser && contactAssignment && isJean && orgPermission;

    const showFollowupStatus = !personIsCurrentUser && isJean && orgPermission && !isMissionhubUser(orgPermission);

    const menuItems = [
      {
        label: t('edit'),
        action: () => dispatch(navigatePush(ADD_CONTACT_SCREEN, {
          person,
          isJean,
          onComplete: () => dispatch(navigateBack()),
        })),
      },
      showDelete ? {
        label: t('delete'),
        action: this.unassignAction(true),
      } : null,
      showFollowupStatus ? {
        label: t('attemptedContact'),
        action: () => dispatch(updateFollowupStatus(person, orgPermission.id, 'attempted_contact')),
        selected: orgPermission.followup_status === 'attempted_contact',
      } : null,
      showFollowupStatus ? {
        label: t('completed'),
        action: () => dispatch(updateFollowupStatus(person, orgPermission.id, 'completed')),
        selected: orgPermission.followup_status === 'completed',
      } : null,
      showFollowupStatus ? {
        label: t('contacted'),
        action: () => dispatch(updateFollowupStatus(person, orgPermission.id, 'contacted')),
        selected: orgPermission.followup_status === 'contacted',
      } : null,
      showFollowupStatus ? {
        label: t('doNotContact'),
        action: () => dispatch(updateFollowupStatus(person, orgPermission.id, 'do_not_contact')),
        selected: orgPermission.followup_status === 'do_not_contact',
      } : null,
      showFollowupStatus ? {
        label: t('uncontacted'),
        action: () => dispatch(updateFollowupStatus(person, orgPermission.id, 'uncontacted')),
        selected: orgPermission.followup_status === 'uncontacted',
      } : null,
      showAssign ? {
        action: () => dispatch(createContactAssignment(organization && organization.id, myId, person.id)),
        label: t('assign'),
      } : null,
      showUnassign ? {
        label: t('unassign'),
        action: this.unassignAction(),
      } : null,
    ].filter(Boolean);

    return (
      <SideMenu menuItems={menuItems} />
    );
  }
}

export const mapStateToProps = ({ auth, people }, { navigation }) => {
  const navParams = navigation.state.params;
  const orgId = navParams.organization && navParams.organization.id;
  const person = personSelector({ people }, { personId: navParams.person.id, orgId }) || navParams.person;

  return {
    ...(navigation.state.params || {}),
    person,
    isJean: auth.isJean,
    personIsCurrentUser: navigation.state.params.person.id === auth.personId,
    myId: auth.personId,
    contactAssignment: contactAssignmentSelector({ auth }, { person, orgId }),
    orgPermission: orgPermissionSelector(null, { person, organization: navParams.organization }),
  };
};

export default connect(mapStateToProps)(ContactSideMenu);
