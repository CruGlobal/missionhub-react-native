import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/navigation';
import { addNewContact } from '../../actions/organizations';
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

  savePerson() {
    let saveData = { ...this.state.data };
    if (this.props.organization) {
      saveData.orgId = this.props.organization.id;
    }
    this.props.dispatch(addNewContact(saveData)).then((results) => {
      if (this.props.onComplete) {
        this.props.onComplete(results);
      }
      this.props.dispatch(navigateBack());
    });
  }

  render() {
    const { t, organization } = this.props;
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
          title={orgName ? t('addToOrg', { orgName }) : t('addSomeone').toUpperCase()}
        />
        <AddContactFields onUpdateData={this.handleUpdateData} />

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
  organization: PropTypes.object,
  onComplete: PropTypes.func,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(AddContactScreen);
