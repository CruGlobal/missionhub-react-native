/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import React, { useEffect, useState, useRef } from 'react';
import { KeyboardAvoidingView, View, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { orgPermissionSelector } from '../../selectors/people';
import { Flex, Text, Input } from '../../components/common';
import theme from '../../theme';
import { hasOrgPermissions } from '../../utils/common';
import { Person } from '../../reducers/people';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

interface PersonData {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
}

interface AddContactFieldsProps {
  isMe?: boolean;
  person: Person;
  organization: Organization;
  onUpdateData: (data: PersonData) => void;
}

const AddContactFields = ({
  isMe = false,
  person,
  organization,
  onUpdateData,
}: AddContactFieldsProps) => {
  const { t } = useTranslation('addContact');
  const [firstName, changeFirstName] = useState(
    person.first_name || person.firstName || '',
  );
  const [lastName, changeLastName] = useState(
    person.last_name || person.lastName || '',
  );

  const [currentInputField, changeCurrentInputField] = useState('');
  const personOrgPermission = useSelector(() =>
    orgPermissionSelector({}, { person, organization }),
  );

  useEffect(() => {
    const newState = {
      firstName,
      lastName,
    };
    onUpdateData(newState);
  }, [firstName, lastName]);

  const updateField = (field: string, data: string) => {
    switch (field) {
      case 'firstName':
        changeFirstName(data);
        break;
      case 'lastName':
        changeLastName(data);
        break;
    }
  };

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const lastNameFocus = () => lastNameRef?.current?.focus();
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
              <Text style={styles.addPersonText}>{t('prompt')}</Text>
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
          returnKeyType="done"
          blurOnSubmit={false}
          onFocus={() => changeCurrentInputField('lastName')}
          onBlur={() => changeCurrentInputField('')}
        />
      </Flex>
    </KeyboardAvoidingView>
  );
};

export default AddContactFields;
