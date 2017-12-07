import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { Flex, Text, Input } from '../../components/common';

class AddContactFields extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: null,
    path: null,
  }

  updateField(field, data) {
    this.setState({ [field]: data }, () => {
      this.props.onUpdateData(this.state);
    });
  }

  render() {
    const { firstName, lastName, email, phone } = this.state;
    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Text i18n="Profile_Label_FirstName" style={styles.label} />
          <Input
            ref={(c) => this.firstName = c}
            onChangeText={(t) => this.updateField('firstName', t)}
            value={firstName}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.lastName.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text i18n="Profile_Label_LastName" style={styles.label} />
          <Input
            ref={(c) => this.lastName = c}
            onChangeText={(t) => this.updateField('lastName', t)}
            value={lastName}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.email.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text i18n="Profile_Label_Email" style={styles.label} />
          <Input
            ref={(c) => this.email = c}
            onChangeText={(t) => this.updateField('email', t)}
            value={email}
            keyboardType="email-address"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.phone.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text i18n="Profile_Label_Phone" style={styles.label} />
          <Input
            ref={(c) => this.phone = c}
            onChangeText={(t) => this.updateField('phone', t)}
            value={phone}
            keyboardType="phone-pad"
            returnKeyType="done"
            blurOnSubmit={true}
          />
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}

AddContactFields.propTypes = {
  onUpdateData: PropTypes.func.isRequired,
};

export default connect()(AddContactFields);
