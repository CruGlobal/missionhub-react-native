/* eslint complexity: 0, max-lines-per-function: 0 */

import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/react-hooks';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import AddContactFields from '../AddContactFields';
import { trackActionWithoutData } from '../../actions/analytics';
import {
  ACTIONS,
  CANNOT_EDIT_FIRST_NAME,
  LOAD_PERSON_DETAILS,
} from '../../constants';
import BackIcon from '../../../assets/images/backIcon.svg';
import { Person } from '../../reducers/people';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { useIsMe } from '../../utils/hooks/useIsMe';
import { CREATE_PERSON, UPDATE_PERSON } from '../SetupScreen/queries';
import {
  CreatePerson,
  CreatePersonVariables,
} from '../SetupScreen/__generated__/CreatePerson';
import {
  UpdatePerson,
  UpdatePersonVariables,
} from '../SetupScreen/__generated__/UpdatePerson';
import { ErrorNotice } from '../../components/ErrorNotice/ErrorNotice';
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
  const isEdit = !!currentPerson?.id;
  const isMe = useIsMe(person.id);
  const handleUpdateData = (newData: Person) => {
    setPerson({ ...person, ...newData });
  };

  const [createPerson, { error: createError }] = useMutation<
    CreatePerson,
    CreatePersonVariables
  >(CREATE_PERSON);

  const [updatePerson, { error: updateError }] = useMutation<
    UpdatePerson,
    UpdatePersonVariables
  >(UPDATE_PERSON);

  const complete = (didSavePerson: boolean, person?: Person) => {
    dispatch(
      next({
        personId: person?.id,
        relationshipType: person?.relationshipType,
        orgId: organization?.id,
        didSavePerson,
        isMe: isMe,
      }),
    );
  };

  const completeWithoutSave = () => {
    complete(false);
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
    const saveData = person;
    let results;
    // debugger;
    try {
      if (isEdit) {
        const { data: updateData } = await updatePerson({
          variables: {
            input: {
              id: saveData.id,
              firstName: saveData.firstName,
              lastName: saveData.lastName,
            },
          },
        });
        // Update person's data in redux
        updateData?.updatePerson?.person &&
          dispatch({
            type: LOAD_PERSON_DETAILS,
            person: {
              first_name: updateData?.updatePerson?.person.firstName,
              last_name: updateData?.updatePerson?.person.lastName,
              id: updateData?.updatePerson?.person.id,
            },
          });
        results = updateData?.updatePerson?.person;
      } else {
        const { data: createData } = await createPerson({
          variables: {
            input: {
              firstName: saveData.firstName,
              lastName: saveData.lastName,
              assignToMe: true,
            },
          },
        });
        // Load person's data in redux
        createData?.createPerson?.person &&
          dispatch({
            type: LOAD_PERSON_DETAILS,
            person: {
              first_name: createData?.createPerson?.person.firstName,
              last_name: createData?.createPerson?.person.lastName,
              id: createData?.createPerson?.person.id,
            },
          });
        results = createData?.createPerson?.person;
      }

      setPerson({ ...person, id: results?.id });
      !isEdit && dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));

      complete(true, results);
    } catch (error) {
      handleError(error);
    }
  };

  const isDisabled = () => {
    const saveData = person;
    if (saveData.firstName === undefined) {
      saveData.firstName = person.first_name;
    }
    return !saveData.firstName;
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
      <ErrorNotice
        error={updateError}
        message={t('updateError')}
        refetch={savePerson}
      />
      <ErrorNotice
        error={createError}
        message={t('createError')}
        refetch={savePerson}
      />
      <ScrollView style={styles.scrollView}>
        <AddContactFields
          // @ts-ignore
          testID="contactFields"
          isMe={isMe}
          person={person}
          organization={organization}
          onUpdateData={handleUpdateData}
        />
      </ScrollView>
      <BottomButton
        testID="continueButton"
        style={isDisabled() ? styles.disabledButton : null}
        onPress={savePerson}
        text={t('continue')}
      />
    </View>
  );
};

export default AddContactScreen;
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
