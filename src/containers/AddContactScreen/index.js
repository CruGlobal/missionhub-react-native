import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { PERSON_STAGE_SCREEN } from '../PersonStageScreen';
import { navigateBack, navigatePush } from '../../actions/navigation';
import { addNewContact } from '../../actions/organizations';
import { updatePerson } from '../../actions/person';
import styles from './styles';
import { Flex, Button, PlatformKeyboardAvoidingView, IconButton } from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';
import { findAllNonPlaceHolders } from '../../utils/common';
import { trackAction } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

@translate('addContact')
class AddContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      contactCreated: false,
    };

    this.savePerson = this.savePerson.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
  }

  handleUpdateData(data) {
    this.setState({ data });
  }

  complete(addedResults) {
    if (this.props.onComplete) {
      this.props.onComplete(addedResults);
    } else {
      this.props.dispatch(navigateBack());
    }
  }

  async savePerson() {
    const { me, organization, dispatch, person } = this.props;
    let saveData = { ...this.state.data };
    if (organization) {
      saveData.orgId = organization.id;
    }
    const isEdit = person;
    const results = await dispatch(isEdit || this.state.contactCreated ? updatePerson(saveData) : addNewContact(saveData));
    this.setState({ contactCreated: true });
    const newPerson = findAllNonPlaceHolders(results, 'person')[0];

    if (isEdit && !newPerson) {
      this.complete(results);
    } else {
      // If adding a new person, select a stage for them, then run all the onComplete functionality
      const contactAssignment = newPerson.reverse_contact_assignments.find((a) => a.assigned_to.id === me.id);
      const contactAssignmentId = contactAssignment && contactAssignment.id;
      dispatch(navigatePush(PERSON_STAGE_SCREEN, {
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
      }));

      this.props.dispatch(trackAction(ACTIONS.PERSON_ADDED));
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
              onPress={() => this.props.dispatch(navigateBack())} />
          }
          shadow={false}
          title={person ? t('editPerson').toUpperCase() : orgName ? t('addToOrg', { orgName }) : t('addSomeone').toUpperCase()}
        />
        <AddContactFields person={person} isJean={isJean} onUpdateData={this.handleUpdateData} />

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.savePerson}
            text={t('done').toUpperCase()}
            style={styles.button}
          />
        </Flex>
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
