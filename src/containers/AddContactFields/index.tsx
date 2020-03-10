/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import React, { Component, Fragment } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { connect } from 'react-redux-legacy';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { ORG_PERMISSIONS } from '../../constants';
import { orgPermissionSelector } from '../../selectors/people';
import { Flex, Text, Input, RadioButton } from '../../components/common';
import theme from '../../theme';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
  isAdminOrOwner,
  hasOrgPermissions,
} from '../../utils/common';

import styles from './styles';

// @ts-ignore
@withTranslation('addContact')
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
      // @ts-ignore
      person,
      // @ts-ignore
      orgPermission,
      // @ts-ignore
      isJean,
      // @ts-ignore
      organization,
      // @ts-ignore
      isGroupInvite,
      // @ts-ignore
      myOrgPermissions,
    } = this.props;
    // If there is no person passed in, we are creating a new one
    if (!person) {
      if (isJean && organization && organization.id) {
        // Default the orgPermission for creating new people to 'Member' if 'me' has admin permission and it's the invite page
        if (isGroupInvite && isAdminOrOwner(myOrgPermissions)) {
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
      // @ts-ignore
      this.props.onUpdateData(newState);
    }
  }

  // @ts-ignore
  updateOrgPermission = pId => {
    this.updateField('orgPermission', {
      ...this.state.orgPermission,
      permission_id: pId,
    });
  };

  // @ts-ignore
  updateField(field, data) {
    this.setState({ [field]: data }, () => {
      // @ts-ignore
      this.props.onUpdateData(this.state);
    });
  }

  // @ts-ignore
  firstNameRef = c => (this.firstName = c);

  // @ts-ignore
  lastNameRef = c => (this.lastName = c);

  // @ts-ignore
  emailRef = c => (this.email = c);

  // @ts-ignore
  phoneRef = c => (this.phone = c);

  // @ts-ignore
  lastNameFocus = () => this.lastName.focus();

  // @ts-ignore
  emailFocus = () => this.email && this.email.focus();

  // @ts-ignore
  phoneFocus = () => this.phone.focus();

  // @ts-ignore
  updateFirstName = t => this.updateField('firstName', t);
  // @ts-ignore
  updateLastName = t => this.updateField('lastName', t);
  // @ts-ignore
  updateEmail = t => this.updateField('email', t);
  // @ts-ignore
  updatePhone = t => this.updateField('phone', t);
  updateGenderMale = () => this.updateField('gender', 'Male');
  updateGenderFemale = () => this.updateField('gender', 'Female');

  render() {
    const {
      // @ts-ignore
      t,
      // @ts-ignore
      isJean,
      // @ts-ignore
      organization,
      // @ts-ignore
      myOrgPermissions,
      // @ts-ignore
      orgPermission: personOrgPermission,
      // @ts-ignore
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

    // @ts-ignore
    const selectedOrgPermId = `${orgPermission.permission_id}`;
    // Email is required if the new person is going to be a user or admin for an organization
    const isEmailRequired = hasOrgPermissions(orgPermission);

    // Disable the name fields if this person has org permission because you are not allowed to edit the names of other mission hub users
    const personHasOrgPermission = hasOrgPermissions(personOrgPermission);
    return (
      <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
        <Flex direction="column">
          <Flex value={2} justify="end" align="center">
            <View style={styles.textWrap}>
              <Text style={styles.addPersonText}>{t('prompt.part1')}</Text>
              <Text style={styles.addPersonText}>{t('prompt.part2')}</Text>
              <Text style={styles.addPersonText}>{t('prompt.part3')}</Text>
            </View>
          </Flex>
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
            placeholder={t('profileLabels.lastNameOptional')}
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
                  {hasOrgPermissions(myOrgPermissions) ? (
                    <RadioButton
                      style={styles.radioButton}
                      pressProps={[ORG_PERMISSIONS.USER]}
                      onSelect={this.updateOrgPermission}
                      checked={selectedOrgPermId === ORG_PERMISSIONS.USER}
                      label={t('profileLabels.user')}
                    />
                  ) : null}
                  {isAdminOrOwner(myOrgPermissions) ? (
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

// @ts-ignore
AddContactFields.propTypes = {
  person: PropTypes.object,
  onUpdateData: PropTypes.func.isRequired,
  isGroupInvite: PropTypes.bool,
};

// @ts-ignore
const mapStateToProps = ({ auth }, { person, organization }) => ({
  myOrgPermissions:
    organization &&
    organization.id &&
    // @ts-ignore
    orgPermissionSelector(null, {
      person: auth.person,
      organization: { id: organization.id },
    }),
  orgPermission:
    person &&
    organization &&
    organization.id &&
    // @ts-ignore
    orgPermissionSelector(null, {
      person,
      organization: { id: organization.id },
    }),
});
export default connect(mapStateToProps)(AddContactFields);
