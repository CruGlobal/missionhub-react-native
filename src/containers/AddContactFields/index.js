import React, { Component, Fragment } from 'react';
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
    const {
      person,
      orgPermission,
      isJean,
      organization,
      isGroupInvite,
      myOrgPermissions,
    } = this.props;
    // If there is no person passed in, we are creating a new one
    if (!person) {
      if (isJean && organization && organization.id) {
        const myOrgPermId = myOrgPermissions && myOrgPermissions.permission_id;
        // Default the orgPermission for creating new people to 'Member' if 'me' has admin permission and it's the invite page
        if (isGroupInvite && myOrgPermId === ORG_PERMISSIONS.ADMIN) {
          this.updateField('orgPermission', {
            ...(orgPermission || {}),
            permission_id: ORG_PERMISSIONS.USER,
          });
        } else {
          // Default the orgPermission for creating new people to 'Contact'
          this.updateField('orgPermission', {
            ...(orgPermission || {}),
            permission_id: ORG_PERMISSIONS.CONTACT,
          });
        }
      }
    } else {
      // If person exists, then we are in edit mode
      const email = getPersonEmailAddress(person) || {};
      const phone = getPersonPhoneNumber(person) || {};
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
              orgPermission: orgPermission || {},
            }
          : {}),
      };
      this.setState(newState);
      this.props.onUpdateData(newState);
    }
  }

  updateOrgPermission = pId => {
    this.updateField('orgPermission', {
      ...this.state.orgPermission,
      permission_id: pId,
    });
  };

  updateField(field, data) {
    this.setState({ [field]: data }, () => {
      this.props.onUpdateData(this.state);
    });
  }

  firstNameRef = c => (this.firstName = c);

  lastNameRef = c => (this.lastName = c);

  emailRef = c => (this.email = c);

  phoneRef = c => (this.phone = c);

  lastNameFocus = () => this.lastName.focus();

  emailFocus = () => this.email && this.email.focus();

  phoneFocus = () => this.phone.focus();

  updateFirstName = t => this.updateField('firstName', t);
  updateLastName = t => this.updateField('lastName', t);
  updateEmail = t => this.updateField('email', t);
  updatePhone = t => this.updateField('phone', t);
  updateGenderMale = () => this.updateField('gender', 'Male');
  updateGenderFemale = () => this.updateField('gender', 'Female');

  render() {
    const {
      t,
      isJean,
      organization,
      myOrgPermissions,
      orgPermission: personOrgPermission,
      isGroupInvite,
    } = this.props;
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      orgPermission,
    } = this.state;

    const selectedOrgPermId = orgPermission.permission_id;
    // Email is required if the new person is going to be a user or admin for an organization
    const isEmailRequired =
      selectedOrgPermId === ORG_PERMISSIONS.USER ||
      selectedOrgPermId === ORG_PERMISSIONS.ADMIN;

    // Disable the name fields if this person has org permission because you are not allowed to edit the names of other mission hub users
    const personHasOrgPermission =
      personOrgPermission &&
      (personOrgPermission.permission_id === ORG_PERMISSIONS.USER ||
        personOrgPermission.permission_id === ORG_PERMISSIONS.ADMIN);
    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Text style={styles.label}>
            {t('profileLabels.firstNameRequired')}
          </Text>
          <Input
            ref={this.firstNameRef}
            editable={!personHasOrgPermission}
            onChangeText={this.updateFirstName}
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
            editable={!personHasOrgPermission}
            onChangeText={this.updateLastName}
            value={lastName}
            placeholder={t('profileLabels.lastName')}
            placeholderTextColor={theme.white}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={this.emailFocus}
          />
        </Flex>
        {isJean ? (
          <Fragment>
            <Flex direction="column" key="email">
              <Text style={styles.label}>{t('profileLabels.email')}</Text>
              <Input
                ref={this.emailRef}
                onChangeText={this.updateEmail}
                value={email}
                autoCapitalize="none"
                placeholder={
                  isEmailRequired
                    ? t('profileLabels.emailRequired')
                    : t('profileLabels.email')
                }
                placeholderTextColor={theme.white}
                keyboardType="email-address"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={this.phoneFocus}
              />
            </Flex>
            {!isGroupInvite ? (
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
                  onSelect={this.updateGenderMale}
                  checked={gender === 'Male'}
                  label={t('gender.male')}
                />
                <RadioButton
                  style={styles.genderRadioButton}
                  onSelect={this.updateGenderFemale}
                  checked={gender === 'Female'}
                  label={t('gender.female')}
                />
              </Flex>
            ) : null}
            {!isGroupInvite ? (
              <Flex direction="column" key="phone">
                <Text style={styles.label}>{t('profileLabels.phone')}</Text>
                <Input
                  ref={this.phoneRef}
                  onChangeText={this.updatePhone}
                  value={phone}
                  placeholder={t('profileLabels.phone')}
                  placeholderTextColor={theme.white}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </Flex>
            ) : null}
            {organization && organization.id ? (
              <Fragment>
                <Text style={styles.label}>
                  {t('profileLabels.permissions')}:
                </Text>
                <Flex
                  direction="row"
                  align="center"
                  style={styles.permissionsRow}
                >
                  {!isGroupInvite ? (
                    <RadioButton
                      style={styles.radioButton}
                      pressProps={[ORG_PERMISSIONS.CONTACT]}
                      onSelect={this.updateOrgPermission}
                      checked={selectedOrgPermId === ORG_PERMISSIONS.CONTACT}
                      label={t('profileLabels.contact')}
                    />
                  ) : null}
                  {myOrgPermissions &&
                  (myOrgPermissions.permission_id === ORG_PERMISSIONS.USER ||
                    myOrgPermissions.permission_id ===
                      ORG_PERMISSIONS.ADMIN) ? (
                    <RadioButton
                      style={styles.radioButton}
                      pressProps={[ORG_PERMISSIONS.USER]}
                      onSelect={this.updateOrgPermission}
                      checked={selectedOrgPermId === ORG_PERMISSIONS.USER}
                      label={t('profileLabels.user')}
                    />
                  ) : null}
                  {myOrgPermissions &&
                  myOrgPermissions.permission_id === ORG_PERMISSIONS.ADMIN ? (
                    <RadioButton
                      style={styles.radioButton}
                      pressProps={[ORG_PERMISSIONS.ADMIN]}
                      onSelect={this.updateOrgPermission}
                      checked={selectedOrgPermId === ORG_PERMISSIONS.ADMIN}
                      label={t('profileLabels.admin')}
                    />
                  ) : null}
                </Flex>
              </Fragment>
            ) : null}
          </Fragment>
        ) : null}
      </KeyboardAvoidingView>
    );
  }
}

AddContactFields.propTypes = {
  person: PropTypes.object,
  onUpdateData: PropTypes.func.isRequired,
  isGroupInvite: PropTypes.bool,
};

const mapStateToProps = ({ auth }, { person, organization }) => ({
  myOrgPermissions:
    auth &&
    organization &&
    organization.id &&
    orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    }),
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
