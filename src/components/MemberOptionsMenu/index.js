import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import PopupMenu from '../PopupMenu';

@translate('groupMemberOptions')
class MemberOptionsMenu extends Component {
  leaveCommunity = () => {
    //TODO: leave community
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

  createOption = (optionName, optionMethod, hasDescription) => {
    const {
      t,
      person: { full_name: personName },
      organization: { name: communityName },
    } = this.props;

    const onPress = () => {
      Alert.alert(
        t(`${optionName}.modalTitle`, { personName, communityName }),
        hasDescription ? t(`${optionName}.modalDescription`) : null,
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t(`${optionName}.confirmButtonText`),
            onPress: optionMethod,
          },
        ],
      );
    };

    return [{ text: t(`${optionName}.optionTitle`), onPress }];
  };

  render() {
    const { t, myId, person, iAmAdmin, iAmOwner, personIsAdmin } = this.props;

    const personIsMe = myId === person.id;

    const showLeaveCommunity = personIsMe;
    const showMakeAdmin = !personIsMe && iAmAdmin && !personIsAdmin;
    const showRemoveAdmin = !personIsMe && iAmAdmin && personIsAdmin;
    const showMakeOwner = !personIsMe && iAmOwner;
    const showRemoveMember = !personIsMe && iAmAdmin;

    const props = {
      actions: [
        ...(showLeaveCommunity
          ? this.createOption('leaveCommunity', this.leaveCommunity)
          : []),
        ...(showMakeAdmin
          ? this.createOption('makeAdmin', this.makeAdmin, true)
          : []),
        ...(showRemoveAdmin
          ? this.createOption('removeAdmin', this.removeAdmin)
          : []),
        ...(showMakeOwner
          ? this.createOption('makeOwner', this.makeOwner, true)
          : []),
        ...(showRemoveMember
          ? this.createOption('removeMember', this.removeMember)
          : []),
      ],
      iconProps: {},
    };
    return <PopupMenu {...props} />;
  }
}

MemberOptionsMenu.propTypes = {
  myId: PropTypes.string.isRequired,
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  iAmAdmin: PropTypes.bool,
  iAmOwner: PropTypes.bool,
  personIsAdmin: PropTypes.bool,
};

export default MemberOptionsMenu;
