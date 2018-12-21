import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { navigateBack, navigatePush } from '../../actions/navigation';
import { addNewPerson } from '../../actions/organizations';
import { updatePerson } from '../../actions/person';
import { Button, IconButton } from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, CANNOT_EDIT_FIRST_NAME } from '../../constants';
import { orgPermissionSelector } from '../../selectors/people';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
  hasOrgPermissions,
} from '../../utils/common';

import styles from './styles';

@translate('addContact')
class AddContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: props.person || {},
    };

    this.savePerson = this.savePerson.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
  }

  handleUpdateData(newData) {
    this.setState({ person: { ...this.state.person, ...newData } });
  }

  complete(addedResults) {
    if (this.props.onComplete) {
      this.props.onComplete(addedResults);
    } else {
      this.props.dispatch(navigateBack());
    }
  }

  async savePerson() {
    const {
      t,
      me,
      organization,
      person,
      dispatch,
      personOrgPermission,
      isInvite,
    } = this.props;
    const saveData = { ...this.state.person };

    // For new User/Admin people, the name, email, and permissions are required fields
    if (
      (!saveData.email || !saveData.firstName) &&
      hasOrgPermissions(saveData.orgPermission)
    ) {
      Alert.alert(t('alertBlankEmail'), t('alertPermissionsMustHaveEmail'));
      return;
    }

    if (person) {
      // Remove the first name if it's the same as before so we don't try to update it with the API
      if (saveData.firstName === person.first_name) {
        delete saveData.firstName;
      }
      // Remove the lastname if it's the same as before or it didn't exist before and a blank string is passed in
      if (
        (saveData.lastName === '' && !person.last_name) ||
        saveData.lastName === person.last_name
      ) {
        delete saveData.lastName;
      }
      if (saveData.gender === person.gender) {
        delete saveData.gender;
      }

      // Only remove the org permission if it's the same as the current persons org permission
      if (
        saveData.orgPermission &&
        personOrgPermission &&
        saveData.orgPermission.permission_id ===
          personOrgPermission.permission_id
      ) {
        delete saveData.orgPermission;
      }

      const personEmail = (getPersonEmailAddress(person) || {}).email;
      if (saveData.email === personEmail) {
        delete saveData.email;
      }
      const personPhone = (getPersonPhoneNumber(person) || {}).number;
      if (saveData.phone === personPhone) {
        delete saveData.phone;
      }
    }

    if (organization) {
      saveData.orgId = organization.id;
    }
    saveData.assignToMe = !isInvite;

    try {
      const results = await dispatch(
        saveData.id ? updatePerson(saveData) : addNewPerson(saveData),
      );
      const newPerson = results.response;
      this.setState({ person: { ...this.state.person, id: newPerson.id } });

      if (person || isInvite) {
        // We know this is an edit if person was passed as a prop. Otherwise, it is an add new contact flow.
        this.complete(results);
      } else {
        // If adding a new person, select a stage for them, then run all the onComplete functionality
        const contactAssignment = (
          newPerson.reverse_contact_assignments || []
        ).find(a => a.assigned_to.id === me.id);
        const contactAssignmentId = contactAssignment && contactAssignment.id;

        dispatch(
          navigatePush(PERSON_STAGE_SCREEN, {
            onCompleteCelebration: () => {
              this.complete(results);
            },
            addingContactFlow: true,
            enableBackButton: false,
            currentStage: null,
            name: newPerson.first_name,
            contactId: newPerson.id,
            contactAssignmentId: contactAssignmentId,
            section: 'people',
            subsection: 'person',
            orgId: organization && organization.id,
          }),
        );

        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
      }
    } catch (error) {
      if (error && error.apiError) {
        if (
          error.apiError.errors &&
          error.apiError.errors[0] &&
          error.apiError.errors[0].detail
        ) {
          const errorDetail = error.apiError.errors[0].detail;
          if (errorDetail === CANNOT_EDIT_FIRST_NAME) {
            Alert.alert(t('alertSorry'), t('alertCannotEditFirstName'));
          }
        }
      }
    }
  }

  navigateBack = () => this.props.dispatch(navigateBack());

  render() {
    const { t, organization, person, isJean, isInvite } = this.props;
    const orgName = organization ? organization.name : undefined;

    return (
      <View style={styles.container}>
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={this.navigateBack}
            />
          }
          shadow={false}
          title={
            person
              ? t('editPerson').toUpperCase()
              : orgName
                ? t('addToOrg', { orgName })
                : t('addSomeone').toUpperCase()
          }
        />
        <ScrollView style={styles.scrollView}>
          <AddContactFields
            person={person}
            organization={organization}
            isJean={isJean}
            isGroupInvite={isInvite}
            onUpdateData={this.handleUpdateData}
          />
        </ScrollView>

        <Button
          type="secondary"
          onPress={this.savePerson}
          text={t('done').toUpperCase()}
          style={styles.button}
        />
      </View>
    );
  }
}

AddContactScreen.propTypes = {
  person: PropTypes.object,
  organization: PropTypes.object,
  onComplete: PropTypes.func,
  isInvite: PropTypes.bool,
};

const mapStateToProps = ({ auth }, { navigation }) => {
  const navProps = navigation.state.params || {};
  const person = navProps.person;
  const organization = navProps.organization;
  return {
    me: auth.person,
    isJean: auth.isJean,
    personOrgPermission:
      person &&
      organization &&
      organization.id &&
      orgPermissionSelector(null, {
        person,
        organization: { id: organization.id },
      }),
    ...navProps,
  };
};

export default connect(mapStateToProps)(AddContactScreen);
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
