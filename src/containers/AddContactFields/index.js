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

  updateField(field, data) {
    this.setState({ [field]: data }, () => {
      this.props.onUpdateData(this.state);
    });
  }

  render() {
    const { t } = this.props;
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
        <Flex direction="column">
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
        </Flex>
        <Flex direction="row" align="center" style={styles.genderRow}>
          <Text style={styles.genderText}>{t('profileLabels.gender')}:</Text>
          <RadioButton
            style={styles.radioButton}
            onSelect={() => this.updateField('gender', 'M')}
            checked={gender === 'M'}
            label={t('gender.male')}
          />
          <RadioButton
            style={styles.radioButton}
            onSelect={() => this.updateField('gender', 'F')}
            checked={gender === 'F'}
            label={t('gender.female')}
          />
        </Flex>
        <Flex direction="column">
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
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}

AddContactFields.propTypes = {
  onUpdateData: PropTypes.func.isRequired,
};

export default connect()(AddContactFields);
