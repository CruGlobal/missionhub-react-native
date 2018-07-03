import React, { Component } from 'react';
import { Alert } from 'react-native';
import { DrawerActions } from 'react-navigation';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import SideMenu from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../containers/AddContactScreen';
import { STATUS_REASON_SCREEN } from '../../containers/StatusReasonScreen';
import {
  createContactAssignment,
  deleteContactAssignment,
  updateFollowupStatus,
} from '../../actions/person';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
  personSelector,
} from '../../selectors/people';
import { isMissionhubUser } from '../../utils/common';

@translate('contactSideMenu')
export class PersonSideMenu extends Component {
  groupUnassign = () => {
    const { dispatch, person, organization, contactAssignment } = this.props;
    dispatch(
      navigatePush(STATUS_REASON_SCREEN, {
        person,
        organization,
        contactAssignment,
        onSubmit: () => dispatch(navigateBack(2)),
      }),
    );
  };

  render() {
    const {
      t,
      dispatch,
      isJean,
      personIsCurrentUser,
      myId,
      person,
      orgPermission,
      contactAssignment,
      organization,
    } = this.props;

    const showAssign = !personIsCurrentUser && !contactAssignment;
    const showUnassign =
      !personIsCurrentUser && contactAssignment && isJean && orgPermission;

    const menuItems = [
      {
        label: t('edit'),
        action: () =>
          dispatch(
            navigatePush(ADD_CONTACT_SCREEN, {
              person,
              isJean,
              onComplete: () => dispatch(navigateBack()),
            }),
          ),
      },
      showAssign
        ? {
            action: () =>
              dispatch(
                createContactAssignment(
                  organization && organization.id,
                  myId,
                  person.id,
                ),
              ),
            label: t('assign'),
          }
        : null,
      showUnassign
        ? {
            label: t('unassign'),
            action: this.groupUnassign,
          }
        : null,
    ].filter(Boolean);

    return <SideMenu menuItems={menuItems} />;
  }
}

export const mapStateToProps = ({ auth, people }, { navigation }) => {
  const navParams = navigation.state.params;
  const orgId = navParams.organization && navParams.organization.id;
  const person =
    personSelector({ people }, { personId: navParams.person.id, orgId }) ||
    navParams.person;
  const orgPermission = orgPermissionSelector(null, {
    person,
    organization: navParams.organization,
  });

  return {
    ...(navigation.state.params || {}),
    person,
    isJean: auth.isJean,
    personIsCurrentUser: navigation.state.params.person.id === auth.person.id,
    myId: auth.person.id,
    contactAssignment: contactAssignmentSelector({ auth }, { person, orgId }),
    orgPermission: orgPermission,
    isMissionhubUser: isMissionhubUser(orgPermission),
  };
};

export default connect(mapStateToProps)(PersonSideMenu);
