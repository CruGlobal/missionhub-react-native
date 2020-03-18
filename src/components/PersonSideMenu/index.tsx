/* eslint max-lines-per-function: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux-legacy';
import { withTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';

import { deleteContactAssignment } from '../../actions/person';
import SideMenu from '../../components/SideMenu';
import { navigatePush, navigateBack } from '../../actions/navigation';
import { EDIT_PERSON_FLOW } from '../../routes/constants';
import { STATUS_REASON_SCREEN } from '../../containers/StatusReasonScreen';
import { assignContactAndPickStage } from '../../actions/misc';
import {
  contactAssignmentSelector,
  orgPermissionSelector,
  personSelector,
} from '../../selectors/people';
import {
  showAssignButton,
  showUnassignButton,
  showDeleteButton,
  orgIsCru,
  orgIsUserCreated,
} from '../../utils/common';

// @ts-ignore
@withTranslation('contactSideMenu')
class PersonSideMenu extends Component {
  // @ts-ignore
  onSubmitReason = () => this.props.dispatch(navigateBack(2));

  deleteContact() {
    return () => {
      // @ts-ignore
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
              // @ts-ignore
              this.deleteOnUnmount = true;
              dispatch(navigateBack(2)); // Navigate back since the contact is no longer in our list
            },
          },
        ],
      );
    };
  }

  async componentWillUnmount() {
    // @ts-ignore
    if (this.deleteOnUnmount) {
      // @ts-ignore
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
      // @ts-ignore
      t,
      // @ts-ignore
      dispatch,
      // @ts-ignore
      isCruOrg,
      // @ts-ignore
      isUserCreated,
      // @ts-ignore
      personIsCurrentUser,
      // @ts-ignore
      myId,
      // @ts-ignore
      person,
      // @ts-ignore
      orgPermission,
      // @ts-ignore
      contactAssignment,
      // @ts-ignore
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
      !isUserCreated
        ? {
            label: t('edit'),
            action: () =>
              dispatch(
                navigatePush(EDIT_PERSON_FLOW, {
                  person,
                  organization,
                }),
              ),
          }
        : null,
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
              // @ts-ignore
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

    // @ts-ignore
    return <SideMenu menuItems={menuItems} />;
  }
}

// @ts-ignore
PersonSideMenu.propTypes = {
  person: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
  isCruOrg: PropTypes.bool.isRequired,
  isUserCreated: PropTypes.bool.isRequired,
};

// @ts-ignore
const mapStateToProps = ({ auth, people }, { navigation }) => {
  const navParams = navigation.state.params || {};
  const { person: navPerson = {}, organization: navOrg = {} } = navParams;
  const orgId = navOrg.id;
  const personId = navPerson.id;
  const myId = auth.person.id;

  const person = personSelector({ people }, { personId, orgId }) || navPerson;
  // @ts-ignore
  const orgPermission = orgPermissionSelector(null, {
    person,
    organization: { id: orgId },
  });

  return {
    ...navParams,
    person,
    personIsCurrentUser: personId === myId,
    myId,
    contactAssignment: contactAssignmentSelector({ auth }, { person, orgId }),
    orgPermission,
    isCruOrg: orgIsCru(navOrg),
    isUserCreated: orgIsUserCreated(navOrg),
  };
};

export default connect(mapStateToProps)(PersonSideMenu);
