import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { transferOrgOwnership } from '../../actions/organizations';
import PopupMenu from '../PopupMenu';
import {
  makeAdmin,
  removeAsAdmin,
  archiveOrgPermission,
} from '../../actions/person';
import { navigateToMainTabs } from '../../actions/navigation';
import { Person } from '../../reducers/people';
import { COMMUNITIES_TAB } from '../../constants';
import { RootState } from '../../reducers';

import styles from './styles';

export const API_TRY_IT_NOW_ADMIN_OWNER_ERROR_MESSAGE =
  'New owner has not created an account';

// @ts-ignore
@withTranslation('groupMemberOptions')
class MemberOptionsMenu extends Component<{
  dispatch: ThunkDispatch<RootState, never, AnyAction>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  person: Person;
  organization: { id: string; name: string };
  personOrgPermission: { id: string; permission: string };
  onActionTaken: () => void;
}> {
  leaveCommunityOnUnmount = false;

  async componentWillUnmount() {
    if (this.leaveCommunityOnUnmount) {
      const { dispatch, person, personOrgPermission } = this.props;

      await dispatch(archiveOrgPermission(person.id, personOrgPermission.id));
    }
  }

  leaveCommunity = () => {
    const { dispatch, onActionTaken } = this.props;

    this.leaveCommunityOnUnmount = true;
    onActionTaken();
    dispatch(navigateToMainTabs(COMMUNITIES_TAB));
  };

  updatePermissionHandleTryItNowError = async (
    // @ts-ignore
    action,
    // @ts-ignore
    tryItNowErrorMessageFunction,
  ) => {
    // @ts-ignore
    const { dispatch, t, onActionTaken } = this.props;

    try {
      await dispatch(action);
      onActionTaken();
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
      // @ts-ignore
      errorDetail => errorDetail.permission_id && errorDetail.permission_id[0],
    );
  };

  removeAsAdmin = async () => {
    const { dispatch, person, personOrgPermission, onActionTaken } = this.props;

    await dispatch(removeAsAdmin(person.id, personOrgPermission.id));
    onActionTaken();
  };

  makeOwner = () => {
    const { organization, person } = this.props;

    return this.updatePermissionHandleTryItNowError(
      transferOrgOwnership(organization.id, person.id),
      // @ts-ignore
      errorDetail => errorDetail,
    );
  };

  removeFromCommunity = async () => {
    const { dispatch, person, personOrgPermission, onActionTaken } = this.props;

    await dispatch(archiveOrgPermission(person.id, personOrgPermission.id));
    onActionTaken();
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

    return this.createOption('leaveCommunity', this.leaveCommunity);
  };

  // @ts-ignore
  createOption = (optionName, optionMethod, hasDescription = false) => {
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
            this.createOption('removeAdmin', this.removeAsAdmin)
          : []),
        ...(showMakeOwner
          ? this.createOption('makeOwner', this.makeOwner, true)
          : []),
        ...(showRemoveFromCommunity
          ? // prettier-ignore
            this.createOption('removeMember', this.removeFromCommunity)
          : []),
      ],
      buttonProps: { style: styles.container },
    };

    return <PopupMenu testID="popupMenu" {...props} />;
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
