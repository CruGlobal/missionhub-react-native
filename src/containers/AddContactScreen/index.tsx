/* eslint complexity: 0, max-lines-per-function: 0 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
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
  LOAD_PERSON_DETAILS,
  CANNOT_EDIT_FIRST_NAME,
} from '../../constants';
import BackIcon from '../../../assets/images/backIcon.svg';
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
import { LoadingWheel } from '../../components/common';
import CloseIcon from '../../../assets/images/closeButton.svg';
import theme from '../../theme';
import { getPersonDetails } from '../../actions/person';

import { GET_PERSON } from './queries';
import styles from './styles';
import {
  GetPerson,
  GetPersonVariables,
  GetPerson_person,
} from './__generated__/GetPerson';

interface AddContactScreenProps {
  next: (props: {
    personId?: string;
    relationshipType?: RelationshipTypeEnum | null;
    orgId: string;
    didSavePerson?: boolean;
    isMe?: boolean;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
}

export type PersonType = Omit<GetPerson_person, '__typename'>;

const AddContactScreen = ({ next }: AddContactScreenProps) => {
  const { t } = useTranslation('addContact');
  const dispatch = useDispatch();
  useAnalytics(['people', 'add']);
  const organization = useNavigationParam('organization');
  const personId = useNavigationParam<string>('person')?.id || '';

  const [person, setPerson] = useState<PersonType>({
    id: '',
    firstName: '',
    lastName: '',
    stage: null,
    relationshipType: null,
  });

  const { loading, error: loadingError, refetch } = useQuery<
    GetPerson,
    GetPersonVariables
  >(GET_PERSON, {
    variables: { id: personId },
    onCompleted: data => setPerson(data.person),
    skip: !personId,
  });

  const isEdit = !!personId;
  const isMe = useIsMe(person.id);
  const handleUpdateData = (newData: PersonType) => {
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

  const complete = (didSavePerson: boolean, person?: PersonType) => {
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

  const savePerson = async () => {
    const saveData = person;
    let results;

    try {
      if (isEdit) {
        const { data: updateData } = await updatePerson({
          variables: {
            input: {
              id: saveData.id,
              firstName: saveData.firstName,
              lastName: saveData.lastName,
              relationshipType: saveData.relationshipType,
            },
          },
        });
        // Update person's data in redux
        updateData?.updatePerson?.person &&
          dispatch(
            getPersonDetails(
              updateData?.updatePerson?.person?.id,
              organization?.id,
            ),
          );
        results = updateData?.updatePerson?.person as PersonType;
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
        results = createData?.createPerson?.person as PersonType;
      }

      results && setPerson({ ...person, id: results.id });
      !isEdit && dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));

      complete(true, results);
    } catch {}
  };

  return (
    <View style={isEdit ? styles.editContainer : styles.container}>
      <Header
        left={
          isEdit ? null : (
            <BackIcon
              testID="backIcon"
              style={{ marginLeft: 10 }}
              onPress={completeWithoutSave}
              color={theme.white}
            />
          )
        }
        right={
          isEdit ? (
            <CloseIcon
              testID="closeIcon"
              style={{ marginRight: 10 }}
              color={theme.extraLightGrey}
              onPress={completeWithoutSave}
            />
          ) : null
        }
        title={isEdit ? t('editPerson') : ''}
        titleStyle={styles.headerTitle}
      />
      <ErrorNotice
        error={updateError}
        message={t('updateError')}
        refetch={savePerson}
        specificErrors={[
          {
            condition: CANNOT_EDIT_FIRST_NAME,
            message: t('alertCannotEditFirstName'),
          },
        ]}
      />
      <ErrorNotice
        error={createError}
        message={t('createError')}
        refetch={savePerson}
      />
      <ErrorNotice
        error={loadingError}
        message={t('loadingError')}
        refetch={refetch}
      />
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <LoadingWheel />
        ) : (
          <AddContactFields
            // @ts-ignore
            testID="contactFields"
            person={person}
            next={next}
            organization={organization}
            onUpdateData={handleUpdateData}
          />
        )}
      </ScrollView>
      <BottomButton
        testID="continueButton"
        style={!person.firstName ? styles.disabledButton : null}
        onPress={savePerson}
        disabled={!person.firstName}
        text={isEdit ? t('done') : t('continue')}
      />
    </View>
  );
};

export default AddContactScreen;
export const ADD_CONTACT_SCREEN = 'nav/ADD_CONTACT';
