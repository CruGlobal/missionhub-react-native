import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { ORG_PERMISSIONS } from '../../constants';
import { orgPermissionSelector } from '../../selectors/people';
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
    orgPermission: {},
  };

  componentDidMount() {
    const { person, orgPermission, isJean } = this.props;
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
              orgPermission,
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

  render() {
    const { t, isJean, organization } = this.props;
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      orgPermission,
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Text style={styles.label}>
            {t('profileLabels.firstNameRequired')}
          </Text>
          <Input
            ref={c => (this.firstName = c)}
            onChangeText={t => this.updateField('firstName', t)}
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
            ref={c => (this.lastName = c)}
            onChangeText={t => this.updateField('lastName', t)}
            value={lastName}
            placeholder={t('profileLabels.lastName')}
            placeholderTextColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => this.email && this.email.focus()}
          />
        </Flex>
        {isJean
          ? [
              <Flex direction="column" key="email">
                <Text style={styles.label}>{t('profileLabels.email')}</Text>
                <Input
                  ref={c => (this.email = c)}
                  onChangeText={t => this.updateField('email', t)}
                  value={email}
                  placeholder={t('profileLabels.email')}
                  placeholderTextColor={theme.white}
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={() => this.phone.focus()}
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
                  style={styles.genderRadioButton}
                  onSelect={() => this.updateField('gender', 'Male')}
                  checked={gender === 'Male'}
                  label={t('gender.male')}
                />
                <RadioButton
                  style={styles.genderRadioButton}
                  onSelect={() => this.updateField('gender', 'Female')}
                  checked={gender === 'Female'}
                  label={t('gender.female')}
                />
              </Flex>,
              <Flex direction="column" key="phone">
                <Text style={styles.label}>{t('profileLabels.phone')}</Text>
                <Input
                  ref={c => (this.phone = c)}
                  onChangeText={t => this.updateField('phone', t)}
                  value={phone}
                  placeholder={t('profileLabels.phone')}
                  placeholderTextColor={theme.white}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </Flex>,
              organization && organization.id
                ? [
                    <Text style={styles.label} key="permissionsLabel">
                      {t('profileLabels.permissions')}:
                    </Text>,
                    <Flex
                      direction="row"
                      align="center"
                      style={styles.permissionsRow}
                      key="permissions"
                    >
                      <RadioButton
                        style={styles.contactRadioButton}
                        onSelect={() =>
                          this.updateField('orgPermission', {
                            ...orgPermission,
                            permission_id: ORG_PERMISSIONS.CONTACT,
                          })
                        }
                        checked={
                          orgPermission.permission_id ===
                          ORG_PERMISSIONS.CONTACT
                        }
                        label={t('profileLabels.contact')}
                      />
                      <RadioButton
                        style={styles.userRadioButton}
                        onSelect={() =>
                          this.updateField('orgPermission', {
                            ...orgPermission,
                            permission_id: ORG_PERMISSIONS.USER,
                          })
                        }
                        checked={
                          orgPermission.permission_id === ORG_PERMISSIONS.USER
                        }
                        label={t('profileLabels.member')}
                      />
                      <RadioButton
                        style={styles.adminRadioButton}
                        onSelect={() =>
                          this.updateField('orgPermission', {
                            ...orgPermission,
                            permission_id: ORG_PERMISSIONS.ADMIN,
                          })
                        }
                        checked={
                          orgPermission.permission_id === ORG_PERMISSIONS.ADMIN
                        }
                        label={t('profileLabels.admin')}
                      />
                    </Flex>,
                  ]
                : [],
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

const mapStateToProps = (_, { person, organization }) => ({
  orgPermission:
    person &&
    organization &&
    organization.id &&
    orgPermissionSelector(null, {
      person,
      organization: { id: organization.id },
    }),
});
export default connect(mapStateToProps)(AddContactFields);
