import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../containers/AddContactScreen';
import { createContactAssignment, deleteContactAssignment, fetchVisiblePersonInfo, updateFollowupStatus } from '../../actions/profile';
import { deleteStep } from '../../actions/steps';

@translate('contactSideMenu')
export class ContactSideMenu extends Component {

  unassignAction(contactAssignmentId, deleteMode = false) {
    return () => {
      const { t, dispatch } = this.props;
      const { person } = this.props.visiblePersonInfo;
      Alert.alert(
        t(deleteMode ? 'deleteQuestion' : 'unassignQuestion', { name: person.first_name }),
        t(deleteMode ? 'deleteSentence' : 'unassignSentence'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: async() => {
              await dispatch(deleteContactAssignment(contactAssignmentId));
              if (deleteMode) {
                for (const challenge of person.received_challenges) {
                  await dispatch(deleteStep(challenge.id));
                }
                dispatch(navigateBack()); // Navigate back twice (out of side menu and out of contact) since we deleted the person
              }
              dispatch(navigateBack());
            },
          },
        ],
      );
    };
  }

  render() {
    const { t, dispatch, myId, stages, organization } = this.props;
    const { isJean, personIsCurrentUser, person } = this.props.visiblePersonInfo;

    const isCaseyNotMe = !isJean && !personIsCurrentUser;
    const isJeanNotMe = isJean && !personIsCurrentUser;

    const orgPermission = organization && person.organizational_permissions && person.organizational_permissions.find((orgPermission) => orgPermission.organization_id === organization.id);
    const contactAssignment = person.reverse_contact_assignments && person.reverse_contact_assignments.find((assignment) => assignment.assigned_to && assignment.assigned_to.id === myId);

    const canEditFollowupStatus = isJeanNotMe && orgPermission;

    const menuItems = [
      {
        label: t('edit'),
        action: () => this.props.dispatch(navigatePush(ADD_CONTACT_SCREEN, { person, isJean, onComplete: () => dispatch(fetchVisiblePersonInfo(person.id, myId, personIsCurrentUser, stages)) })),
      },
      isCaseyNotMe && contactAssignment ? {
        label: t('delete'),
        action: this.unassignAction(contactAssignment.id, true),
      } : null,
      canEditFollowupStatus ? {
        label: t('attemptedContact'),
        action: () => this.props.dispatch(updateFollowupStatus(person.id, orgPermission.id, 'attempted_contact')),
        selected: orgPermission.followup_status === 'attempted_contact',
      } : null,
      canEditFollowupStatus ? {
        label: t('completed'),
        action: () => this.props.dispatch(updateFollowupStatus(person.id, orgPermission.id, 'completed')),
        selected: orgPermission.followup_status === 'completed',
      } : null,
      canEditFollowupStatus ? {
        label: t('contacted'),
        action: () => this.props.dispatch(updateFollowupStatus(person.id, orgPermission.id, 'contacted')),
        selected: orgPermission.followup_status === 'contacted',
      } : null,
      canEditFollowupStatus ? {
        label: t('doNotContact'),
        action: () => this.props.dispatch(updateFollowupStatus(person.id, orgPermission.id, 'do_not_contact')),
        selected: orgPermission.followup_status === 'do_not_contact',
      } : null,
      canEditFollowupStatus ? {
        label: t('uncontacted'),
        action: () => this.props.dispatch(updateFollowupStatus(person.id, orgPermission.id, 'uncontacted')),
        selected: orgPermission.followup_status === 'uncontacted',
      } : null,
      isJeanNotMe && !contactAssignment ? {
        label: t('assign'),
        action: () => dispatch(createContactAssignment(organization.id, myId, person.id)),
      } : null,
      isJeanNotMe && contactAssignment ? {
        label: t('unassign'),
        action: this.unassignAction(contactAssignment.id),
      } : null,
    ].filter(Boolean);

    return (
      <SideMenu menuItems={menuItems} />
    );
  }
}

const mapStateToProps = ({ profile, auth, stages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  myId: auth.personId,
  stages: stages.stages,
  visiblePersonInfo: profile.visiblePersonInfo || {},
});

export default connect(mapStateToProps)(ContactSideMenu);
