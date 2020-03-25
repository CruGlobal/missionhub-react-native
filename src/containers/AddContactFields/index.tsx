/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import React, { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, View, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

interface PersonData {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  userGender?: string | null;
  gender?: string | null;
  email?: string;
  emailId?: string;
  phone?: string;
  phoneId?: string;
  orgPermission?: {
    permission_id: string;
  };
}

interface AddContactFieldsProps {
  isMe?: boolean;
  person: Person;
  organization: Organization;
  isJean?: boolean;
  isGroupInvite?: boolean;
  onUpdateData: (data: PersonData) => void;
}

const AddContactFields = ({
  isMe = false,
  person,
  organization,
  isJean = false,
  isGroupInvite = false,
  onUpdateData,
}: AddContactFieldsProps) => {
  const { t } = useTranslation('addContact');
  const [firstName, changeFirstName] = useState('');
  const [lastName, changeLastName] = useState('');
  const [email, changeEmail] = useState({ email: '', id: '' });
  const [phone, changePhone] = useState({ number: '', id: '' });
  const [gender, changeGender] = useState<string | null>(null);
  const [orgPermission, changeOrgPermission] = useState({ permission_id: '' });
  const [currentInputField, changeCurrentInputField] = useState('');

  const auth = useSelector<{ auth: AuthState }, AuthState>(({ auth }) => auth);
  const myOrgPermission = useSelector(() =>
    orgPermissionSelector({}, { person: auth.person, organization }),
  );
  const personOrgPermission = useSelector(() =>
    orgPermissionSelector({}, { person, organization }),
  );

  useEffect(() => {
    if (!person) {
      if (isJean && organization?.id) {
        if (isGroupInvite && isAdminOrOwner(myOrgPermission)) {
          changeOrgPermission({
            ...personOrgPermission,
            permission_id: ORG_PERMISSIONS.USER,
          });
        } else {
          changeOrgPermission({
            ...personOrgPermission,
            permission_id: ORG_PERMISSIONS.CONTACT,
          });
        }
      }
    } else {
      const personEmail = getPersonEmailAddress(person) || {};
      const personPhone = getPersonPhoneNumber(person) || {};
      changeFirstName(person.first_name);
      changeLastName(person.last_name);
      changeEmail(personEmail);
      changePhone(personPhone);
      changeGender(person.gender);
      const newState = {
        firstName,
        lastName,
        ...(isJean
          ? {
              emailId: email.id,
              email: email.email,
              phoneId: phone.id,
              phone: phone.number,
              userGender: gender,
              orgPermission: orgPermission || {},
            }
          : {}),
      };
      onUpdateData(newState);
    }
  }, []);

  useEffect(() => {
    const newState = {
      firstName,
      lastName,
      ...(isJean
        ? {
            emailId: email.id,
            email: email.email,
            phoneId: phone.id,
            phone: phone.number,
            userGender: gender,
            orgPermission: orgPermission || {},
          }
        : {}),
    };
    onUpdateData(newState);
  }, [firstName, lastName, email, phone, gender, orgPermission]);

  const updateOrgPermission = (pId: string) => {
    changeOrgPermission({ ...orgPermission, permission_id: pId });
  };

  const updateField = (field: string, data: string) => {
    switch (field) {
      case 'firstName':
        changeFirstName(data);
        break;
      case 'lastName':
        changeLastName(data);
        break;
      case 'email':
        changeEmail({ ...email, email: data });
        break;
      case 'phone':
        changePhone({ ...phone, number: data });
        break;
      case 'gender':
        changeGender(data);
        break;
      case 'orgPermission':
        updateOrgPermission(data);
        break;
    }
  };

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const lastNameFocus = () => lastNameRef?.current?.focus();
  const emailFocus = () => emailRef?.current?.focus();
  const phoneFocus = () => phoneRef?.current?.focus();
  // Email is required if the new person is going to be a user or admin for an organization
  const isEmailRequired = hasOrgPermissions(orgPermission);
  // Check if current field is the one the user is focused on in order to change style
  const isCurrentField = (field: string) => currentInputField === field;
  // Disable the name fields if this person has org permission because you are not allowed to edit the names of other mission hub users
  const personHasOrgPermission = hasOrgPermissions(personOrgPermission);
  return (
    <KeyboardAvoidingView style={styles.fieldsWrap} behavior="position">
      <Flex direction="column">
        <Flex value={2} justify="end" align="center">
          {isMe ? null : (
            <View style={styles.textWrap}>
              <Text style={styles.addPersonText}>{t('prompt.part1')}</Text>
              <Text style={styles.addPersonText}>{t('prompt.part2')}</Text>
              <Text style={styles.addPersonText}>{t('prompt.part3')}</Text>
            </View>
          )}
        </Flex>
        {firstName || isCurrentField('firstName') ? (
          <Text style={styles.label}>
            {t('profileLabels.firstNameNickname')}
          </Text>
        ) : (
          <Text style={styles.label}>{}</Text>
        )}

        <Input
          testID="firstNameInput"
          ref={firstNameRef}
          editable={!personHasOrgPermission}
          selectionColor={theme.challengeBlue}
          onChangeText={(firstName: string) =>
            updateField('firstName', firstName)
          }
          value={firstName}
          placeholder={
            isCurrentField('firstName')
              ? ''
              : t('profileLabels.firstNameRequired')
          }
          placeholderTextColor={theme.white}
          returnKeyType="next"
          blurOnSubmit={false}
          autoFocus={true}
          onFocus={() => changeCurrentInputField('firstName')}
          onBlur={() => changeCurrentInputField('')}
          onSubmitEditing={lastNameFocus}
        />
      </Flex>
      <Flex direction="column">
        {lastName || isCurrentField('lastName') ? (
          <Text style={styles.label}>{t('profileLabels.lastName')}</Text>
        ) : (
          <Text style={styles.label}>{}</Text>
        )}

        <Input
          testID="lastNameInput"
          ref={lastNameRef}
          editable={!personHasOrgPermission}
          selectionColor={theme.challengeBlue}
          onChangeText={(lastName: string) => updateField('lastName', lastName)}
          value={lastName}
          placeholder={
            isCurrentField('lastName')
              ? ''
              : t('profileLabels.lastNameOptional')
          }
          placeholderTextColor={theme.white}
          returnKeyType="next"
          blurOnSubmit={false}
          onFocus={() => changeCurrentInputField('lastName')}
          onBlur={() => changeCurrentInputField('')}
          onSubmitEditing={emailFocus}
        />
      </Flex>
      {isJean ? (
        <>
          <Flex direction="column" key="email">
            <Text style={styles.label}>{t('profileLabels.email')}</Text>
            <Input
              testID="emailInput"
              ref={emailRef}
              onChangeText={(email: string) => updateField('email', email)}
              selectionColor={theme.challengeBlue}
              value={email.email}
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
              onSubmitEditing={phoneFocus}
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
                // @ts-ignore
                testID={'maleGenderButton'}
                style={styles.genderRadioButton}
                onSelect={() => updateField('gender', 'Male')}
                checked={gender === 'Male'}
                label={t('gender.male')}
              />
              <RadioButton
                // @ts-ignore
                testID={'femaleGenderButton'}
                style={styles.genderRadioButton}
                onSelect={() => updateField('gender', 'Female')}
                checked={gender === 'Female'}
                label={t('gender.female')}
              />
            </Flex>
          ) : null}
          {!isGroupInvite ? (
            <Flex direction="column" key="phone">
              <Text style={styles.label}>{t('profileLabels.phone')}</Text>
              <Input
                testID="phoneInput"
                ref={phoneRef}
                onChangeText={(phone: string) => updateField('phone', phone)}
                selectionColor={theme.challengeBlue}
                value={phone.number}
                placeholder={t('profileLabels.phone')}
                placeholderTextColor={theme.white}
                keyboardType="phone-pad"
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </Flex>
          ) : null}
          {organization?.id ? (
            <>
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
                    // @ts-ignore
                    testID={'contactRadioButton'}
                    style={styles.radioButton}
                    pressProps={[ORG_PERMISSIONS.CONTACT]}
                    onSelect={() =>
                      updateField('orgPermission', ORG_PERMISSIONS.CONTACT)
                    }
                    checked={
                      orgPermission.permission_id === ORG_PERMISSIONS.CONTACT
                    }
                    label={t('profileLabels.contact')}
                  />
                ) : null}
                {hasOrgPermissions(myOrgPermission) ? (
                  <RadioButton
                    // @ts-ignore
                    testID={'userRadioButton'}
                    style={styles.radioButton}
                    pressProps={[ORG_PERMISSIONS.USER]}
                    onSelect={() =>
                      updateField('orgPermission', ORG_PERMISSIONS.USER)
                    }
                    checked={
                      orgPermission.permission_id === ORG_PERMISSIONS.USER
                    }
                    label={t('profileLabels.user')}
                  />
                ) : null}
                {isAdminOrOwner(myOrgPermission) ? (
                  <RadioButton
                    // @ts-ignore
                    testID={'adminRadioButton'}
                    style={styles.radioButton}
                    pressProps={[ORG_PERMISSIONS.ADMIN]}
                    onSelect={() =>
                      updateField('orgPermission', ORG_PERMISSIONS.USER)
                    }
                    checked={
                      orgPermission.permission_id === ORG_PERMISSIONS.ADMIN
                    }
                    label={t('profileLabels.admin')}
                  />
                ) : null}
              </Flex>
            </>
          ) : null}
        </>
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default AddContactFields;
