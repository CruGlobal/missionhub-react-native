/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import React, { useState, useRef } from 'react';
import { KeyboardAvoidingView, View, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { orgPermissionSelector } from '../../selectors/people';
import { Flex, Text, Input } from '../../components/common';
import theme from '../../theme';
import { hasOrgPermissions } from '../../utils/common';
import { PersonType } from '../AddContactScreen';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { Organization } from '../../reducers/organizations';

import styles from './styles';

interface AddContactFieldsProps {
  person: PersonType;
  organization?: Organization;
  onUpdateData: (data: PersonType) => void;
}

const AddContactFields = ({
  person,
  organization,
  onUpdateData,
}: AddContactFieldsProps) => {
  const { t } = useTranslation('addContact');
  const [currentInputField, changeCurrentInputField] = useState('');
  const isMe = useIsMe(person.id);
  const personOrgPermission = useSelector(() =>
    orgPermissionSelector({}, { person, organization }),
  );

  const updateField = (field: string, data: string) => {
    switch (field) {
      case 'firstName':
        onUpdateData({ ...person, firstName: data });
        break;
      case 'lastName':
        onUpdateData({ ...person, lastName: data });
        break;
    }
  };

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const lastNameFocus = () => lastNameRef.current?.focus();
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
        {person.firstName || isCurrentField('firstName') ? (
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
          selectionColor={theme.parakeetBlue}
          onChangeText={(firstName: string) =>
            updateField('firstName', firstName)
          }
          value={person.firstName}
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
        {person.lastName || isCurrentField('lastName') ? (
          <Text style={styles.label}>{t('profileLabels.lastName')}</Text>
        ) : (
          <Text style={styles.label}>{}</Text>
        )}

        <Input
          testID="lastNameInput"
          ref={lastNameRef}
          editable={!personHasOrgPermission}
          selectionColor={theme.parakeetBlue}
          onChangeText={(lastName: string) => updateField('lastName', lastName)}
          value={person.lastName}
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
