import React, { useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useNavigationParam } from 'react-navigation-hooks';
import { useTranslation } from 'react-i18next';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { DrawerActions } from 'react-navigation-drawer';

import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import AddContactFields, { AddContactFieldsProps } from '../AddContactFields';
import { trackActionWithoutData } from '../../actions/analytics';
import {
  ACTIONS,
  LOAD_PERSON_DETAILS,
  CANNOT_EDIT_FIRST_NAME,
} from '../../constants';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';
import { useIsMe, useMyId } from '../../utils/hooks/useIsMe';
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
import BackButton from '../../components/BackButton';
import CloseButton, { CloseButtonTypeEnum } from '../../components/CloseButton';
import theme from '../../theme';
import { getPersonDetails } from '../../actions/person';
import { RootState } from '../../reducers';

import { GET_PERSON } from './queries';
import styles from './styles';
import {
  GetPerson,
  GetPersonVariables,
  GetPerson_person,
} from './__generated__/GetPerson';

interface AddContactScreenProps {
  // It's weird that in one flow, the child screen calls next and in another, this screen calls it with different props. We should improve this
  next: (
    props:
      | Parameters<AddContactFieldsProps['next']>
      | {
          personId?: string;
          relationshipType?: RelationshipTypeEnum | null;
          didSavePerson?: boolean;
          isMe?: boolean;
        },
  ) => ThunkAction<void, RootState, never, AnyAction>;
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
    fullName: '',
    stage: null,
    steps: {
      __typename: 'StepConnection',
      pageInfo: { __typename: 'BasePageInfo', totalCount: 0 },
    },
    relationshipType: null,
    picture: null,
  });
  const [personImage, setPersonImage] = useState<string | null>(null);

  const { loading, error: loadingError, refetch } = useQuery<
    GetPerson,
    GetPersonVariables
  >(GET_PERSON, {
    variables: { id: personId },
    onCompleted: data => {
      data && setPerson(data.person);
      data && setPersonImage(data.person.picture);
    },
    skip: !personId,
  });

  const isEdit = !!personId;
  const isMe = useIsMe(person.id);
  const myId = useMyId();
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
    // Close sidemenu so we land on person screen with it not opened
    dispatch(DrawerActions.closeDrawer());
    dispatch(
      next({
        personId: person?.id,
        relationshipType: person?.relationshipType,
        didSavePerson,
        isMe: person ? myId === person.id : isMe,
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
              picture:
                saveData.picture !== personImage ? saveData.picture : undefined,
            },
          },
        });
        // Update person's data in redux
        updateData?.updatePerson?.person &&
          dispatch(getPersonDetails(updateData?.updatePerson?.person?.id));
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

      results && setPerson({ ...person, id: results.id });
      if (!isEdit) {
        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
      }

      complete(true, results ?? undefined);
    } catch {}
  };

  return (
    <View style={isEdit ? styles.editContainer : styles.container}>
      <StatusBar {...theme.statusBar.darkContent} />
      <Header
        left={
          isEdit ? null : (
            <BackButton
              customNavigate={completeWithoutSave}
              iconColor={theme.white}
            />
          )
        }
        right={
          isEdit ? (
            <CloseButton
              type={CloseButtonTypeEnum.circle}
              iconColor={theme.extraLightGrey}
              customNavigate={completeWithoutSave}
            />
          ) : null
        }
        title={isEdit ? (isMe ? t('editProfile') : t('editPerson')) : ''}
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
            testID="contactFields"
            person={person}
            next={next as AddContactFieldsProps['next']}
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
