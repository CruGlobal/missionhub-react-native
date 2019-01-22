import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { transferOrgOwnership } from '../../actions/organizations';
import PopupMenu from '../PopupMenu';
import {
  makeAdmin,
  removeAsAdmin,
  archiveOrgPermission,
} from '../../actions/person';
import { navigateBack } from '../../actions/navigation';
import {
  getMyCommunities,
  removeOrganizationMember,
} from '../../actions/organizations';

import styles from './styles';

export const API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE =
  'You must log in for admin or owner permissions';

@translate('groupMemberOptions')
class MemberOptionsMenu extends Component {
  async componentWillUnmount() {
    if (this.leaveCommunityOnUnmount) {
      const { dispatch, person, personOrgPermission } = this.props;

      await dispatch(archiveOrgPermission(person.id, personOrgPermission.id));
      dispatch(getMyCommunities());
    }
  }

  leaveCommunity = () => {
    const { dispatch } = this.props;

    this.leaveCommunityOnUnmount = true;
    dispatch(navigateBack());
  };

  updatePermissionHandleTryItNowError = async (
    action,
    tryItNowErrorMessageFunction,
  ) => {
    const { dispatch, t } = this.props;

    try {
      await dispatch(action);
    } catch (error) {
      const errorDetail =
        error.apiError &&
        error.apiError.errors &&
        error.apiError.errors[0].detail;
      const errorMessage =
        errorDetail && tryItNowErrorMessageFunction(errorDetail);

      if (
        errorMessage &&
        errorMessage.includes(API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE)
      ) {
        return Alert.alert(t('tryItNowAdminOwnerErrorMessage'));
      }

      throw error;
    }
  };

  makeAdmin = () => {
    const { person, personOrgPermission } = this.props;

    return this.updatePermissionHandleTryItNowError(
      makeAdmin(person.id, personOrgPermission.id),
      errorDetail => errorDetail.permission_id && errorDetail.permission_id[0],
    );
  };

  removeAsAdmin = () => {
    const { dispatch, person, personOrgPermission } = this.props;

    dispatch(removeAsAdmin(person.id, personOrgPermission.id));
  };

  makeOwner = () => {
    const { organization, person } = this.props;

    return this.updatePermissionHandleTryItNowError(
      transferOrgOwnership(organization.id, person.id),
      errorDetail => errorDetail,
    );
  };

  removeFromCommunity = async () => {
    const { dispatch, person, personOrgPermission, organization } = this.props;

    await dispatch(archiveOrgPermission(person.id, personOrgPermission.id));
    dispatch(removeOrganizationMember(person.id, organization.id));
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
    const showRemoveAsAdmin = !personIsMe && iAmAdmin && personIsAdmin;
    const showMakeOwner = !personIsMe && iAmOwner;
    const showRemoveFromCommunity = !personIsMe && iAmAdmin;

    const props = {
      actions: [
        ...(showLeaveCommunity ? this.canLeaveCommunity() : []),
        ...(showMakeAdmin
          ? this.createOption('makeAdmin', this.makeAdmin, true)
          : []),
        ...(showRemoveAsAdmin
          ? this.createOption('removeAdmin', this.removeAsAdmin)
          : []),
        ...(showMakeOwner
          ? this.createOption('makeOwner', this.makeOwner, true)
          : []),
        ...(showRemoveFromCommunity
          ? this.createOption('removeMember', this.removeFromCommunity)
          : []),
      ],
      iconProps: {},
      style: styles.container,
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
