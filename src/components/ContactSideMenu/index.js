import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { deleteContactAssignment, fetchVisiblePersonInfo } from '../../actions/profile';
import { deleteStep } from '../../actions/steps';

@translate('contactSideMenu')
export class ContactSideMenu extends Component {

  unassignAction(deleteMode = false) {
    return () => {
      const { t, dispatch } = this.props;
      const { person, contactAssignmentId } = this.props.visiblePersonInfo;
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
    const { t, dispatch, myId, stages } = this.props;
    const { isJean, personIsCurrentUser, person } = this.props.visiblePersonInfo;

    const isCaseyNotMe = !isJean && !personIsCurrentUser;
    const isJeanNotMe = isJean && !personIsCurrentUser;

    const menuItems = [
      {
        label: t('edit'),
        action: () => this.props.dispatch(navigatePush('AddContact', { person, isJean, onComplete: () => dispatch(fetchVisiblePersonInfo(person.id, myId, personIsCurrentUser, stages)) })),
      },
      isCaseyNotMe ? {
        label: t('delete'),
        action: this.unassignAction(true),
      } : null,
      isJeanNotMe ? {
        label: t('attemptedContact'),
        action: () => LOG('attemptedContact pressed'),
      } : null,
      isJeanNotMe ? {
        label: t('completed'),
        action: () => LOG('completed pressed'),
      } : null,
      isJeanNotMe ? {
        label: t('contacted'),
        action: () => LOG('contacted pressed'),
      } : null,
      isJeanNotMe ? {
        label: t('doNotContact'),
        action: () => LOG('doNotContact pressed'),
      } : null,
      isJeanNotMe ? {
        label: t('uncontacted'),
        action: () => LOG('uncontacted pressed'),
      } : null,
      isJeanNotMe ? {
        label: t('unassign'),
        action: this.unassignAction(),
      } : null,
    ].filter(Boolean);

    return (
      <SideMenu menuItems={menuItems} />
    );
  }
}

const mapStateToProps = ({ profile, auth, stages }) => ({
  myId: auth.personId,
  stages: stages.stages,
  visiblePersonInfo: profile.visiblePersonInfo || {},
});

export default connect(mapStateToProps)(ContactSideMenu);
