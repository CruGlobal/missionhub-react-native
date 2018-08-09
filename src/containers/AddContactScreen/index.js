import React, { Component } from 'react';
import { ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { navigateBack, navigatePush } from '../../actions/navigation';
import { addNewContact } from '../../actions/organizations';
import { updatePerson } from '../../actions/person';
import {
  Button,
  PlatformKeyboardAvoidingView,
  IconButton,
} from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';
import { trackActionWithoutData } from '../../actions/analytics';
import {
  ACTIONS,
  ORG_PERMISSIONS,
  CANNOT_EDIT_FIRST_NAME,
} from '../../constants';

import styles from './styles';

@translate('addContact')
class AddContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {},
    };

    this.savePerson = this.savePerson.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
  }

  componentWillMount() {
    const { person } = this.props;
    this.setState({ person });
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
    const { t, me, organization, person, dispatch } = this.props;
    const saveData = { ...this.state.person };

    if (
      !saveData.email &&
      saveData.orgPermission &&
      (saveData.orgPermission.permission_id === ORG_PERMISSIONS.USER ||
        saveData.orgPermission.permission_id === ORG_PERMISSIONS.ADMIN)
    ) {
      Alert.alert(t('alertBlankEmail'), t('alertPermissionsMustHaveEmail'));
      return;
    }

    if (person && saveData.firstName === person.first_name) {
      delete saveData.firstName;
    }
    if (person && saveData.lastName === '' && !person.last_name) {
      delete saveData.lastName;
    }

    if (organization) {
      saveData.orgId = organization.id;
    }
    try {
      const results = await dispatch(
        saveData.id ? updatePerson(saveData) : addNewContact(saveData),
      );
      const newPerson = results.response;
      this.setState({ person: { ...this.state.person, id: newPerson.id } });

      if (person) {
        // We know this is an edit if person was passed as a prop. Otherwise, it is an add new contact flow.
        this.complete(results);
      } else {
        // If adding a new person, select a stage for them, then run all the onComplete functionality
        const contactAssignment = newPerson.reverse_contact_assignments.find(
          a => a.assigned_to.id === me.id,
        );
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
        if (error.apiError.errors && error.apiError.errors[0].detail) {
          const errorDetail = error.apiError.errors[0].detail;
          if (errorDetail === CANNOT_EDIT_FIRST_NAME) {
            Alert.alert(t('alertSorry'), t('alertCannotEditFirstName'));
          }
        }
      }
    }
  }

  render() {
    const { t, organization, person, isJean } = this.props;
    const orgName = organization ? organization.name : undefined;

    return (
      <PlatformKeyboardAvoidingView>
        <Header
          right={
            <IconButton
              name="deleteIcon"
              type="MissionHub"
              onPress={() => this.props.dispatch(navigateBack())}
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
        <ScrollView style={styles.container}>
          <AddContactFields
            person={person}
            organization={organization}
            isJean={isJean}
            onUpdateData={this.handleUpdateData}
          />
        </ScrollView>

        <Button
          type="secondary"
          onPress={this.savePerson}
          text={t('done').toUpperCase()}
          style={styles.button}
        />
      </PlatformKeyboardAvoidingView>
    );
  }
}

AddContactScreen.propTypes = {
  person: PropTypes.object,
  organization: PropTypes.object,
  onComplete: PropTypes.func,
};

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.person,
});

export default connect(mapStateToProps)(AddContactScreen);
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
