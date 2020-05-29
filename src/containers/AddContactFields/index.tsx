/* eslint complexity: 0, max-lines: 0, max-lines-per-function: 0 */

import React, { useState, useRef } from 'react';
import { KeyboardAvoidingView, View, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { orgPermissionSelector } from '../../selectors/people';
import { Flex, Text, Input } from '../../components/common';
import PopupMenu from '../../components/PopupMenu';
import theme from '../../theme';
import { hasOrgPermissions } from '../../utils/common';
import { PersonType } from '../AddContactScreen';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { Organization } from '../../reducers/organizations';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { relationshipTypeList } from '../PersonCategoryScreen';
import DropdownIcon from '../../../assets/images/dropdownIcon.svg';
import Avatar from '../../components/Avatar';
import ImagePicker from '../../components/ImagePicker';
import PencilIcon from '../../../assets/images/pencilIcon.svg';

import styles from './styles';

interface AddContactFieldsProps {
  person: PersonType;
  organization?: Organization;
  onUpdateData: (data: PersonType) => void;
  next: (props: {
    orgId: string;
    navigateToStageSelection: boolean;
    person: PersonType;
    updatePerson: (person: PersonType) => void;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
}

const AddContactFields = ({
  person,
  organization,
  onUpdateData,
  next,
}: AddContactFieldsProps) => {
  const { t } = useTranslation('addContact');
  const [currentInputField, changeCurrentInputField] = useState('');
  const dispatch = useDispatch();
  const isMe = useIsMe(person.id);
  const isEdit = !!person.id && !!person.stage; // Person in onboarding won't have a stage by the time they are at this screen
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
      case 'relationshipType':
        onUpdateData({
          ...person,
          relationshipType: data as RelationshipTypeEnum,
        });
        break;
    }
  };

  const handleImageChange = (data: { data: string }) => {
    onUpdateData({ ...person, picture: data.data });
  };

  const categoryOptions = relationshipTypeList.map(type => {
    return {
      text: t(`categories.${type}`),
      onPress: () => {
        updateField('relationshipType', type);
      },
    };
  });

  const handleStageSelect = () => {
    dispatch(
      next({
        orgId: organization?.id,
        navigateToStageSelection: true,
        person,
        updatePerson: onUpdateData,
      }),
    );
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
        {isEdit ? (
          <Flex align="center">
            {isMe ? (
              <ImagePicker
                // @ts-ignore
                testID="ImagePicker"
                onSelectImage={handleImageChange}
                circleOverlay={true}
              >
                <Avatar person={person} size="large" />
                <View style={styles.changeAvatarButton}>
                  <PencilIcon color={theme.white} />
                </View>
              </ImagePicker>
            ) : null}
          </Flex>
        ) : (
          <Flex value={2} justify="end" align="center">
            {isMe ? null : (
              <View style={styles.textWrap}>
                <Text style={styles.addPersonText}>{t('prompt')}</Text>
              </View>
            )}
          </Flex>
        )}

        {person.firstName || isCurrentField('firstName') ? (
          <Text style={isEdit ? styles.editLabel : styles.label}>
            {isEdit
              ? t('profileLabels.firstName')
              : t('profileLabels.firstNameNickname')}
          </Text>
        ) : (
          <Text style={isEdit ? styles.editLabel : styles.label}>{}</Text>
        )}

        <Input
          testID="firstNameInput"
          ref={firstNameRef}
          style={{
            color: isEdit ? theme.parakeetBlue : theme.white,
            borderBottomColor: isEdit
              ? theme.extraLightGrey
              : theme.parakeetBlue,
          }}
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
          placeholderTextColor={isEdit ? theme.parakeetBlue : theme.white}
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
          <Text style={isEdit ? styles.editLabel : styles.label}>
            {t('profileLabels.lastName')}
          </Text>
        ) : (
          <Text style={isEdit ? styles.editLabel : styles.label}>{}</Text>
        )}

        <Input
          testID="lastNameInput"
          ref={lastNameRef}
          style={{
            color: isEdit ? theme.parakeetBlue : theme.white,
            borderBottomColor: isEdit
              ? theme.extraLightGrey
              : theme.parakeetBlue,
          }}
          editable={!personHasOrgPermission}
          selectionColor={theme.parakeetBlue}
          onChangeText={(lastName: string) => updateField('lastName', lastName)}
          value={person.lastName}
          placeholder={
            isCurrentField('lastName')
              ? ''
              : t('profileLabels.lastNameOptional')
          }
          placeholderTextColor={isEdit ? theme.parakeetBlue : theme.white}
          returnKeyType="done"
          blurOnSubmit={false}
          onFocus={() => changeCurrentInputField('lastName')}
          onBlur={() => changeCurrentInputField('')}
        />
      </Flex>
      {isEdit ? (
        <>
          <Flex direction="column">
            <Text style={isEdit ? styles.editLabel : styles.label}>
              {t('stage')}
            </Text>

            <View style={styles.buttonContainer}>
              <Text
                testID="stageSelectButton"
                onPress={() => handleStageSelect()}
                style={styles.categoryText}
              >
                {person.stage?.name || ''}
              </Text>
            </View>
          </Flex>

          {!isMe ? (
            <Flex direction="column">
              <Text style={isEdit ? styles.editLabel : styles.label}>
                {t('categoryPrompt')}
              </Text>

              <PopupMenu
                // @ts-ignore
                actions={categoryOptions}
                triggerOnLongPress={false}
              >
                <View style={styles.buttonContainer}>
                  <Text style={styles.categoryText}>
                    {person.relationshipType
                      ? t(`categories.${person.relationshipType}`)
                      : t('categoryNull')}
                  </Text>
                  <DropdownIcon color={theme.lightGrey} />
                </View>
              </PopupMenu>
            </Flex>
          ) : null}
        </>
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default AddContactFields;
