import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import PopupMenu from '../PopupMenu';
import { makeAdmin, removeAdmin } from '../../actions/person';

@translate('groupMemberOptions')
class MemberOptionsMenu extends Component {
  leaveCommunity = () => {
    //TODO: leave community
  };

  makeAdmin = () => {
    const { dispatch, person, personOrgPermission } = this.props;
    dispatch(makeAdmin(person.id, personOrgPermission.id));
  };

  removeAdmin = () => {
    const { dispatch, person, personOrgPermission } = this.props;
    dispatch(removeAdmin(person.id, personOrgPermission.id));
  };

  makeOwner = () => {
    //TODO: make owner
  };

  removeMember = () => {
    //TODO: remove member
  };

  canLeaveCommunity = () => {
    const { t, iAmOwner, organization } = this.props;

    if (iAmOwner) {
      const onPress = () => {
        Alert.alert(
          t('ownerLeaveCommunityErrorMessage', { orgName: organization.name }),
          null,
          { text: t('ok') },
        );
      };
      return [{ text: t(`leaveCommunity.optionTitle`), onPress }];
    }

    return this.createOption('leaveCommunity', this.leaveCommunity);
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
    const { myId, person, iAmAdmin, iAmOwner, personIsAdmin } = this.props;

    const personIsMe = myId === person.id;

    const showLeaveCommunity = personIsMe;
    const showMakeAdmin = !personIsMe && iAmAdmin && !personIsAdmin;
    const showRemoveAdmin = !personIsMe && iAmAdmin && personIsAdmin;
    const showMakeOwner = !personIsMe && iAmOwner;
    const showRemoveMember = !personIsMe && iAmAdmin;

    const props = {
      actions: [
        ...(showLeaveCommunity ? this.canLeaveCommunity() : []),
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
  personOrgPermission: PropTypes.object.isRequired,
  iAmAdmin: PropTypes.bool,
  iAmOwner: PropTypes.bool,
  personIsAdmin: PropTypes.bool,
};

export default connect()(MemberOptionsMenu);
