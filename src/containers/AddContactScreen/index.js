import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/navigation';
import { addNewContact } from '../../actions/organizations';
import { updatePerson } from '../../actions/profile';
import styles from './styles';
import { Flex, Button, PlatformKeyboardAvoidingView, IconButton } from '../../components/common';
import Header from '../Header';
import AddContactFields from '../AddContactFields';

@translate('addContact')
class AddContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };

    this.savePerson = this.savePerson.bind(this);
    this.handleUpdateData = this.handleUpdateData.bind(this);
  }

  handleUpdateData(data) {
    this.setState({ data });
  }

  async savePerson() {
    let saveData = { ...this.state.data };
    if (this.props.organization) {
      saveData.orgId = this.props.organization.id;
    }
    const results = await this.props.dispatch(this.props.person ? updatePerson(saveData) : addNewContact(saveData));
    if (this.props.onComplete) {
      this.props.onComplete(results);
    }
    this.props.dispatch(navigateBack());
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

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(AddContactScreen);
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
