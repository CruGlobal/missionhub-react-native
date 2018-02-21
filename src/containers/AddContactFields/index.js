import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text, Input, RadioButton } from '../../components/common';
import theme from '../../theme';

@translate()
class AddContactFields extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: null,
    path: null,
  };

  componentDidMount() {
    const { person, isJean } = this.props;
    // If person exists, then we are in edit mode
    if (!person) {
      return;
    }
    const email = person.email_addresses.find((email) => email.primary) || person.email_addresses[0] || {};
    const phone = person.phone_numbers.find((email) => email.primary) || person.email_addresses[0] || {};
    if (person) {
      const newState = {
        id: person.id,
        firstName: person.first_name,
        lastName: person.last_name,
        ...isJean ? {
          emailId: email.id,
          email: email.email,
          phoneId: phone.id,
          phone: phone.number,
          gender: person.gender,
        } : {},
      };
      this.setState(newState);
      this.props.onUpdateData(newState);
    }
  }

  updateField(field, data) {
    this.setState({ [field]: data }, () => {
      this.props.onUpdateData(this.state);
    });
  }

  render() {
    const { t, isJean } = this.props;
    const { firstName, lastName, email, phone, gender } = this.state;
    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.firstNameRequired')}</Text>
          <Input
            ref={(c) => this.firstName = c}
            onChangeText={(t) => this.updateField('firstName', t)}
            value={firstName}
            placeholder={t('profileLabels.firstNameRequired')}
            placeholderTextColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.lastName.focus()}
          />
        </Flex>
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.lastName')}</Text>
          <Input
            ref={(c) => this.lastName = c}
            onChangeText={(t) => this.updateField('lastName', t)}
            value={lastName}
            placeholder={t('profileLabels.lastName')}
            placeholderTextColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.email.focus()}
          />
        </Flex>
        {isJean ? [
          <Flex direction="column" key="email">
            <Text style={styles.label}>{t('profileLabels.email')}</Text>
            <Input
              ref={(c) => this.email = c}
              onChangeText={(t) => this.updateField('email', t)}
              value={email}
              placeholder={t('profileLabels.email')}
              placeholderTextColor={theme.white}
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.phone.focus()}
            />
          </Flex>,
          <Flex direction="row" align="center" style={styles.genderRow} key="gender">
            <Text style={styles.genderText}>{t('profileLabels.gender')}:</Text>
            <RadioButton
              style={styles.radioButton}
              onSelect={() => this.updateField('gender', 'Male')}
              checked={gender === 'Male'}
              label={t('gender.male')}
            />
            <RadioButton
              style={styles.radioButton}
              onSelect={() => this.updateField('gender', 'Female')}
              checked={gender === 'Female'}
              label={t('gender.female')}
            />
          </Flex>,
          <Flex direction="column" key="phone">
            <Text style={styles.label}>{t('profileLabels.phone')}</Text>
            <Input
              ref={(c) => this.phone = c}
              onChangeText={(t) => this.updateField('phone', t)}
              value={phone}
              placeholder={t('profileLabels.phone')}
              placeholderTextColor={theme.white}
              keyboardType="phone-pad"
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </Flex>,
        ] : []}
      </KeyboardAvoidingView>
    );
  }
}

AddContactFields.propTypes = {
  person: PropTypes.object,
  onUpdateData: PropTypes.func.isRequired,
};

export default connect()(AddContactFields);
