import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
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
import { prompt } from '../../utils/prompt';

@translate('contactSideMenu')
class PersonSideMenu extends Component {
  onSubmitReason = () => this.props.dispatch(navigateBack(2));

  deleteContact() {
    return async () => {
      const { t, dispatch, person, navigation } = this.props;
      if (
        await prompt({
          title: t('deleteQuestion', {
            name: person.first_name,
          }),
          description: t('deleteSentence'),
          actionLabel: t('delete'),
          actionDestructive: true,
        })
      ) {
        this.deleteOnUnmount = true;
        navigation.closeDrawer();
        dispatch(navigateBack()); // Navigate back since the contact is no longer in our list
      }
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
      navigation,
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

    return <SideMenu menuItems={menuItems} navigation={navigation} />;
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
