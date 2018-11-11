import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Share, Linking } from 'react-native';
import { translate } from 'react-i18next';

import PopupMenu from '../PopupMenu';
import { getSurveyUrl, isAdminOrOwner, isOwner } from '../../utils/common';

@translate('groupMemberOptions')
class MemberOptionsMenu extends Component {
  leaveCommunity = () => {
    console.log('Leave Community');
  };

  makeAdmin = () => {
    console.log('Make Admin');
  };

  removeAdmin = () => {
    console.log('Remove Admin');
  };

  makeOwner = () => {
    console.log('Make Owner');
  };

  removeMember = () => {
    console.log('Remove Member');
  };

  render() {
    const {
      t,
      myId,
      personId,
      iAmAdmin,
      iAmOwner,
      personIsAdmin,
      personIsOwner,
    } = this.props;

    const personIsMe = myId === personId;

    const showLeaveCommunity = personIsMe;
    const showMakeAdmin = !personIsMe && iAmAdmin && !personIsAdmin;
    const showRemoveAdmin = !personIsMe && iAmAdmin && personIsAdmin;
    const showMakeOwner = !personIsMe && iAmOwner;
    const showRemoveMember = !personIsMe && iAmAdmin;

    const props = {
      actions: [
        ...(showLeaveCommunity
          ? [{ text: t('leaveCommunity'), onPress: this.leaveCommunity }]
          : []),
        ...(showMakeAdmin
          ? [{ text: t('makeAdmin'), onPress: this.makeAdmin }]
          : []),
        ...(showRemoveAdmin
          ? [{ text: t('removeAdmin'), onPress: this.removeAdmin }]
          : []),
        ...(showMakeOwner
          ? [{ text: t('makeOwner'), onPress: this.makeOwner }]
          : []),
        ...(showRemoveMember
          ? [{ text: t('removeMember'), onPress: this.removeMember }]
          : []),
      ],
      iconProps: {},
    };
    return <PopupMenu {...props} />;
  }
}

MemberOptionsMenu.propTypes = {
  myId: PropTypes.string.isRequired,
  personId: PropTypes.string.isRequired,
  iAmAdmin: PropTypes.bool,
  iAmOwner: PropTypes.bool,
  personIsAdmin: PropTypes.bool,
  personIsOWner: PropTypes.bool,
};

export default MemberOptionsMenu;
