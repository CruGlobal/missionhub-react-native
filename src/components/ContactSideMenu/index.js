import React, { Component } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';
import { navigateBack } from '../../actions/navigation';
import { deleteContactAssignment } from '../../actions/profile';

@translate('contactSideMenu')
export class ContactSideMenu extends Component {

  unassignAction(deleteMode = false) {
    return () => {
      const { t, dispatch } = this.props;
      const { person, contactAssignmentId } = this.props.screenProps;
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
              dispatch(navigateBack());
              deleteMode && dispatch(navigateBack());
            },
          },
        ],
      );
    };
  }

  render() {
    const { t } = this.props;
    const { isJean, personIsCurrentUser } = this.props.screenProps;

    const isCaseyNotMe = !isJean && !personIsCurrentUser;
    const isJeanNotMe = isJean && !personIsCurrentUser;

    const menuItems = [
      {
        label: t('edit'),
        action: () => LOG('edit pressed'),
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

export default connect()(ContactSideMenu);
