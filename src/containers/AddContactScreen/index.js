/* eslint complexity: 0, max-lines-per-function: 0 */

import React, { Component } from 'react';
import { SafeAreaView, View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { addNewPerson } from '../../actions/organizations';
import { updatePerson } from '../../actions/person';
import { IconButton } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
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

  removeUneditedFields() {
    const { person, personOrgPermission, organization, isInvite } = this.props;
    const saveData = { ...this.state.person };

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

    return saveData;
  }

  checkEmailAndName() {
    const { t } = this.props;
    const saveData = { ...this.state.person };

    // For new User/Admin people, the name, email, and permissions are required fields
    if (
      (!saveData.email || !saveData.firstName) &&
      hasOrgPermissions(saveData.orgPermission)
    ) {
      Alert.alert(t('alertBlankEmail'), t('alertPermissionsMustHaveEmail'));
      return false;
    }

    return true;
  }

  handleError(error) {
    const { t } = this.props;

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

  async savePerson() {
    const { dispatch, isEdit, next } = this.props;

    if (!this.checkEmailAndName()) {
      return;
    }

    const saveData = this.removeUneditedFields();

    try {
      const results = await dispatch(
        isEdit ? updatePerson(saveData) : addNewPerson(saveData),
      );

      this.setState({
        person: { ...this.state.person, id: results.response.id },
      });

      !isEdit && dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));

      dispatch(next({ person: results.response }));
    } catch (error) {
      this.handleError(error);
    }
  }

  render() {
    const { t, organization, person, isJean } = this.props;
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
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={styles.scrollView}>
            <AddContactFields
              person={person}
              organization={organization}
              isJean={isJean}
              isGroupInvite={false}
              onUpdateData={this.handleUpdateData}
            />
          </ScrollView>
          <BottomButton onPress={this.savePerson} text={t('done')} />
        </SafeAreaView>
      </View>
    );
  }
}

AddContactScreen.propTypes = {
  person: PropTypes.object,
  organization: PropTypes.object,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }, { navigation }) => {
  const navProps = navigation.state.params || {};
  const { person, organization = {} } = navProps;
  return {
    me: auth.person,
    isJean: auth.isJean,
    personOrgPermission:
      organization.id &&
      orgPermissionSelector(null, {
        person: person || {},
        organization: { id: organization.id },
      }),
    isEdit: !!person,
    ...navProps,
  };
};

export default connect(mapStateToProps)(AddContactScreen);
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
