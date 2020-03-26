/* eslint complexity: 0, max-lines-per-function: 0 */

import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { addNewPerson } from '../../actions/organizations';
import { updatePerson } from '../../actions/person';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import AddContactFields from '../AddContactFields';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, CANNOT_EDIT_FIRST_NAME } from '../../constants';
import { orgPermissionSelector } from '../../selectors/people';
import {
  getPersonEmailAddress,
  getPersonPhoneNumber,
  hasOrgPermissions,
} from '../../utils/common';
import BackIcon from '../../../assets/images/backIcon.svg';
import { AuthState } from '../../reducers/auth';
import { Person } from '../../reducers/people';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { useIsMe } from '../../utils/hooks/useIsMe';
import theme from '../../theme';

import styles from './styles';

interface AddContactScreenProps {
  next: (props: {
    personId?: string;
    relationshipType?: RelationshipTypeEnum;
    orgId: string;
    didSavePerson: boolean;
    isMe: boolean;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
}

const AddContactScreen = ({ next }: AddContactScreenProps) => {
  const { t } = useTranslation('addContact');
  const dispatch = useDispatch();
  useAnalytics(['people', 'add']);
  const organization = useNavigationParam('organization');
  const currentPerson = useNavigationParam('person') || {};
  const [person, setPerson] = useState(currentPerson);
  const personOrgPermission = useSelector(() =>
    orgPermissionSelector({}, { person, organization }),
  );
  const auth = useSelector<{ auth: AuthState }, AuthState>(({ auth }) => auth);
  const isJean = auth.isJean;
  const isEdit = !!currentPerson?.id;
  const isMe = useIsMe(person.id);
  const handleUpdateData = (newData: Person) => {
    setPerson({ ...person, ...newData });
  };

  const complete = (didSavePerson: boolean, person?: Person) => {
    dispatch(
      next({
        personId: person?.id,
        relationshipType: person?.relationship_type,
        orgId: organization?.id,
        didSavePerson,
        isMe: isMe,
      }),
    );
  };

  const completeWithoutSave = () => {
    complete(false);
  };

  const removeUneditedFields = () => {
    const saveData = person;

    if (person) {
      // Remove the first name if it's the same as before so we don't try to update it with the API
      if (saveData.firstName === person.first_name) {
        delete saveData.firstName;
      }
      // Remove the lastname if it's the same as before or it didn't exist before and a blank string is passed in
      if (
        (saveData.lastName === '' && !person.last_name) ||
        saveData.lastName === person.last_name
      ) {
        delete saveData.lastName;
      }
      if (saveData.gender === person.gender) {
        delete saveData.gender;
      }

      // Only remove the org permission if it's the same as the current persons org permission
      if (
        (saveData.orgPermission &&
          personOrgPermission &&
          saveData.orgPermission.permission_id ===
            personOrgPermission.permission_id) ||
        !saveData?.orgPermission?.permission_id
      ) {
        delete saveData.orgPermission;
      }

      const personEmail = (getPersonEmailAddress(person) || {}).email;
      if (saveData.email === personEmail || saveData.email === '') {
        delete saveData.email;
      }

      const personPhone = (getPersonPhoneNumber(person) || {}).number;
      if (saveData.phone === personPhone || saveData.phone === '') {
        delete saveData.phone;
      }
    }

    if (organization) {
      saveData.orgId = organization.id;
    }
    saveData.assignToMe = true;

    return saveData;
  };

  const checkEmailAndName = () => {
    const saveData = person;
    // For new User/Admin people, the name, email, and permissions are required fields
    if (
      (!saveData.email || !saveData.firstName) &&
      hasOrgPermissions(saveData.orgPermission)
    ) {
      Alert.alert(t('alertBlankEmail'), t('alertPermissionsMustHaveEmail'));
      return false;
    }

    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    if (error && error.apiError) {
      if (
        error.apiError.errors &&
        error.apiError.errors[0] &&
        error.apiError.errors[0].detail
      ) {
        const errorDetail = error.apiError.errors[0].detail;
        if (errorDetail === CANNOT_EDIT_FIRST_NAME) {
          Alert.alert(t('alertSorry'), t('alertCannotEditFirstName'));
        }
      }
    }
  };

  const savePerson = async () => {
    if (!checkEmailAndName()) {
      return;
    }

    const saveData = await removeUneditedFields();

    try {
      const results = await dispatch(
        isEdit ? updatePerson(saveData) : addNewPerson(saveData),
      );

      // @ts-ignore
      setPerson({ ...person, id: results.response.id });
      !isEdit && dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
      // @ts-ignore
      complete(true, results.response);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        left={
          <BackIcon
            testID="backIcon"
            style={{ marginLeft: 10 }}
            onPress={completeWithoutSave}
            color={theme.white}
          />
        }
      />
      <ScrollView style={styles.scrollView}>
        <AddContactFields
          // @ts-ignore
          testID="contactFields"
          // @ts-ignore
          isMe={isMe}
          person={person}
          organization={organization}
          isJean={isJean}
          isGroupInvite={false}
          onUpdateData={handleUpdateData}
        />
      </ScrollView>
      <BottomButton
        testID="continueButton"
        style={!person.firstName ? styles.disabledButton : null}
        onPress={savePerson}
        text={t('continue')}
      />
    </View>
  );
};

export default AddContactScreen;
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
