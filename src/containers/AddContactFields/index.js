import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Text, Input, RadioButton } from '../../components/common';
import theme from '../../theme';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
} from '../../utils/common';

import styles from './styles';

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
    const email = getPersonEmailAddress(person) || {};
    const phone = getPersonPhoneNumber(person) || {};

    if (person) {
      const newState = {
        firstName: person.first_name,
        lastName: person.last_name,
        ...(isJean
          ? {
              emailId: email.id,
              email: email.email,
              phoneId: phone.id,
              phone: phone.number,
              gender: person.gender,
            }
          : {}),
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

  firstNameRef = c => (this.firstName = c);

  lastNameRef = c => (this.lastName = c);

  emailRef = c => (this.email = c);

  phoneref = c => (this.phone = c);

  lastNameFocus = () => this.lastName.focus();

  emailFocus = () => this.email && this.email.focus();

  phoneFocus = () => this.phone.focus();

  render() {
    const { t, isJean } = this.props;
    const { firstName, lastName, email, phone, gender } = this.state;

    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Text style={styles.label}>
            {t('profileLabels.firstNameRequired')}
          </Text>
          <Input
            ref={this.firstNameRef}
            onChangeText={t => this.updateField('firstName', t)}
            value={firstName}
            placeholder={t('profileLabels.firstNameRequired')}
            placeholderTextColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={this.lastNameFocus}
          />
        </Flex>
        <Flex direction="column">
          <Text style={styles.label}>{t('profileLabels.lastName')}</Text>
          <Input
            ref={this.lastNameRef}
            onChangeText={t => this.updateField('lastName', t)}
            value={lastName}
            placeholder={t('profileLabels.lastName')}
            placeholderTextColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={this.emailFocus}
          />
        </Flex>
        {isJean
          ? [
              <Flex direction="column" key="email">
                <Text style={styles.label}>{t('profileLabels.email')}</Text>
                <Input
                  ref={this.emailRef}
                  onChangeText={t => this.updateField('email', t)}
                  value={email}
                  placeholder={t('profileLabels.email')}
                  placeholderTextColor={theme.white}
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={this.phoneFocus}
                />
              </Flex>,
              <Flex
                direction="row"
                align="center"
                style={styles.genderRow}
                key="gender"
              >
                <Text style={styles.genderText}>
                  {t('profileLabels.gender')}:
                </Text>
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
                  ref={this.phoneref}
                  onChangeText={t => this.updateField('phone', t)}
                  value={phone}
                  placeholder={t('profileLabels.phone')}
                  placeholderTextColor={theme.white}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </Flex>,
            ]
          : []}
      </KeyboardAvoidingView>
    );
  }
}

AddContactFields.propTypes = {
  person: PropTypes.object,
  onUpdateData: PropTypes.func.isRequired,
};

export default connect()(AddContactFields);
