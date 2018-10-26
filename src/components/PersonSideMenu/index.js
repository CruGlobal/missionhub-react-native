import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Alert } from 'react-native';
import { DrawerActions } from 'react-navigation';
import PropTypes from 'prop-types';

import { deleteContactAssignment } from '../../actions/person';
import SideMenu from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { ADD_CONTACT_SCREEN } from '../../containers/AddContactScreen';
import { STATUS_REASON_SCREEN } from '../../containers/StatusReasonScreen';
import { assignContactAndPickStage } from '../../actions/misc';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
  personSelector,
} from '../../selectors/people';
import {
  isMissionhubUser,
  showAssignButton,
  showUnassignButton,
  showDeleteButton,
} from '../../utils/common';

@translate('contactSideMenu')
class PersonSideMenu extends Component {
  onSubmitReason = () => this.props.dispatch(navigateBack(2));

  deleteContact() {
    return () => {
      const { t, dispatch, person } = this.props;
      Alert.alert(
        t('deleteQuestion', {
          name: person.first_name,
        }),
        t('deleteSentence'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('delete'),
            style: 'destructive',
            onPress: () => {
              this.deleteOnUnmount = true;
              dispatch(DrawerActions.closeDrawer());
              dispatch(navigateBack()); // Navigate back since the contact is no longer in our list
            },
          },
        ],
      );
    };
  }

  async componentWillUnmount() {
    if (this.deleteOnUnmount) {
      const { dispatch, person, contactAssignment, organization } = this.props;
      await dispatch(
        deleteContactAssignment(
          contactAssignment.id,
          person.id,
          organization && organization.id,
        ),
      );
    }
  }

  render() {
    const {
      t,
      dispatch,
      isCruOrg,
      personIsCurrentUser,
      myId,
      person,
      orgPermission,
      contactAssignment,
      organization,
    } = this.props;

    const showAssign = showAssignButton(
      isCruOrg,
      personIsCurrentUser,
      contactAssignment,
    );
    const showUnassign = showUnassignButton(isCruOrg, contactAssignment);
    const showDelete = showDeleteButton(
      personIsCurrentUser,
      contactAssignment,
      orgPermission,
    );

    const menuItems = [
      {
        label: t('edit'),
        action: () =>
          dispatch(
            navigatePush(ADD_CONTACT_SCREEN, {
              person,
              organization,
              onComplete: () => dispatch(navigateBack()),
            }),
          ),
      },
      showDelete
        ? {
            label: t('delete'),
            action: this.deleteContact(),
          }
        : null,
      showAssign
        ? {
            label: t('assign'),
            action: () =>
              dispatch(assignContactAndPickStage(person, organization, myId)),
          }
        : null,
      showUnassign
        ? {
            label: t('unassign'),
            action: () =>
              dispatch(
                navigatePush(STATUS_REASON_SCREEN, {
                  person,
                  organization,
                  contactAssignment,
                  onSubmit: this.onSubmitReason,
                }),
              ),
          }
        : null,
    ].filter(Boolean);

    return <SideMenu menuItems={menuItems} />;
  }
}

PersonSideMenu.propTypes = {
  isCruOrg: PropTypes.bool,
};

const mapStateToProps = ({ auth, people }, { navigation }) => {
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
    personIsCurrentUser: navigation.state.params.person.id === auth.person.id,
    myId: auth.person.id,
    contactAssignment: contactAssignmentSelector({ auth }, { person, orgId }),
    orgPermission: orgPermission,
    isMissionhubUser: isMissionhubUser(orgPermission),
  };
};

export default connect(mapStateToProps)(PersonSideMenu);
