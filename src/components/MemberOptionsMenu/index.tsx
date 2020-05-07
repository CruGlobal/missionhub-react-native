/* eslint complexity: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import {
  transferOrgOwnership,
  removeOrganizationMember,
} from '../../actions/organizations';
import PopupMenu from '../PopupMenu';
import {
  makeAdmin,
  removeAsAdmin,
  archiveOrgPermission,
} from '../../actions/person';
import { navigateBack } from '../../actions/navigation';
import { CommunityMemberPerson } from '../CommunityMemberItem/__generated__/CommunityMemberPerson';

import styles from './styles';

export const API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE =
  'You must log in for admin or owner permissions';

// @ts-ignore
@withTranslation('groupMemberOptions')
class MemberOptionsMenu extends Component<{
  person: CommunityMemberPerson;
  organization: { id: string; name: string };
  personOrgPermission: { id: string; permission: string };
}> {
  async componentWillUnmount() {
    // @ts-ignore
    if (this.leaveCommunityOnUnmount) {
      // @ts-ignore
      const { dispatch, person, personOrgPermission } = this.props;

      await dispatch(archiveOrgPermission(person.id, personOrgPermission.id));
    }
  }

  leaveCommunity = () => {
    // @ts-ignore
    const { dispatch } = this.props;

    // @ts-ignore
    this.leaveCommunityOnUnmount = true;
    dispatch(navigateBack());
  };

  updatePermissionHandleTryItNowError = async (
    // @ts-ignore
    action,
    // @ts-ignore
    tryItNowErrorMessageFunction,
  ) => {
    // @ts-ignore
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
    // @ts-ignore
    const { person, personOrgPermission } = this.props;

    return this.updatePermissionHandleTryItNowError(
      makeAdmin(person.id, personOrgPermission.id),
      // @ts-ignore
      errorDetail => errorDetail.permission_id && errorDetail.permission_id[0],
    );
  };

  removeAsAdmin = () => {
    // @ts-ignore
    const { dispatch, person, personOrgPermission } = this.props;

    dispatch(removeAsAdmin(person.id, personOrgPermission.id));
  };

  makeOwner = () => {
    // @ts-ignore
    const { organization, person } = this.props;

    return this.updatePermissionHandleTryItNowError(
      transferOrgOwnership(organization.id, person.id),
      // @ts-ignore
      errorDetail => errorDetail,
    );
  };

  removeFromCommunity = async () => {
    // @ts-ignore
    const { dispatch, person, personOrgPermission, organization } = this.props;

    await dispatch(archiveOrgPermission(person.id, personOrgPermission.id));
    dispatch(removeOrganizationMember(person.id, organization.id));
  };

  canLeaveCommunity = () => {
    // @ts-ignore
    const { t, iAmOwner, organization } = this.props;

    if (iAmOwner) {
      const onPress = () => {
        Alert.alert(
          t('ownerLeaveCommunityErrorMessage', { orgName: organization.name }),
          // @ts-ignore
          null,
          { text: t('ok') },
        );
      };
      return [{ text: t('leaveCommunity.optionTitle'), onPress }];
    }

    // @ts-ignore
    return this.createOption('leaveCommunity', this.leaveCommunity);
  };

  // @ts-ignore
  createOption = (optionName, optionMethod, hasDescription) => {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      person: { fullName: personName },
      // @ts-ignore
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
    // @ts-ignore
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
          ? // prettier-ignore
            // @ts-ignore
            this.createOption('removeAdmin', this.removeAsAdmin)
          : []),
        ...(showMakeOwner
          ? this.createOption('makeOwner', this.makeOwner, true)
          : []),
        ...(showRemoveFromCommunity
          ? // prettier-ignore
            // @ts-ignore
            this.createOption('removeMember', this.removeFromCommunity)
          : []),
      ],
      buttonProps: { style: styles.container },
    };

    return <PopupMenu {...props} />;
  }
}

// @ts-ignore
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
