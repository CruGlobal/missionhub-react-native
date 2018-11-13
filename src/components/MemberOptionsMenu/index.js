import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Alert } from 'react-native';

import PopupMenu from '../PopupMenu';

@translate('groupMemberOptions')
class MemberOptionsMenu extends Component {
  leaveCommunity = () => {
    const { t, iAmOwner, organization } = this.props;

    if (iAmOwner) {
      Alert.alert(
        t('ownerLeaveCommunityErrorMessage', { orgName: organization.name }),
      );
      return;
    }
  };

  makeAdmin = () => {
    //TODO: make admin
  };

  removeAdmin = () => {
    //TODO: remove admin
  };

  makeOwner = () => {
    //TODO: make owner
  };

  removeMember = () => {
    //TODO: remove member
  };

  render() {
    const { t, myId, personId, iAmAdmin, iAmOwner, personIsAdmin } = this.props;

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
  organization: PropTypes.object.isRequired,
};

export default MemberOptionsMenu;
