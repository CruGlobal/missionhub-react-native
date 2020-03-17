import React, { useRef, useState } from 'react';
import { connect } from 'react-redux-legacy';
import { View, Keyboard, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigationParam } from 'react-navigation-hooks';
import { useMutation } from '@apollo/react-hooks';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Text, Flex, Input } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import { createMyPerson } from '../../actions/onboarding';
import TosPrivacy from '../../components/TosPrivacy';
import { AuthState } from '../../reducers/auth';
import { PeopleState } from '../../reducers/people';
import BackButton from '../BackButton';
import Header from '../../components/Header';
import Skip from '../../components/Skip';
import { useLogoutOnBack } from '../../utils/hooks/useLogoutOnBack';
import { useAnalytics } from '../../utils/hooks/useAnalytics';
import { trackActionWithoutData } from '../../actions/analytics';
import { ACTIONS, LOAD_PERSON_DETAILS } from '../../constants';
import { personSelector } from '../../selectors/people';
import { OnboardingState } from '../../reducers/onboarding';
import { RelationshipTypeEnum } from '../../../__generated__/globalTypes';

import { CREATE_PERSON, UPDATE_PERSON } from './queries';
import {
  CreatePersonVariables,
  CreatePerson,
} from './__generated__/CreatePerson';
import {
  UpdatePerson,
  UpdatePersonVariables,
} from './__generated__/UpdatePerson';
import styles from './styles';

interface SetupScreenProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<{}, {}, any>;
  next: (props: {
    skip?: boolean;
    personId?: string;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
  isMe: boolean;
  personId?: string;
  loadedFirstName?: string;
  loadedLastName?: string;
  hideSkipBtn?: boolean;
}

const SetupScreen = ({
  dispatch,
  next,
  isMe,
  personId,
  loadedFirstName = '',
  loadedLastName = '',
  hideSkipBtn = false,
}: SetupScreenProps) => {
  useAnalytics(['onboarding', `${isMe ? 'self' : 'contact'} name`]);
  const { t } = useTranslation('onboardingCreatePerson');
  const relationshipType: RelationshipTypeEnum = useNavigationParam(
    'relationshipType',
  );
  const [firstName, setFirstName] = useState(loadedFirstName);
  const [lastName, setLastName] = useState(loadedLastName);
  const [isLoading, setIsLoading] = useState(false);
  const lastNameRef = useRef<TextInput>(null);

  const [createPerson] = useMutation<CreatePerson, CreatePersonVariables>(
    CREATE_PERSON,
  );

  const [updatePerson] = useMutation<UpdatePerson, UpdatePersonVariables>(
    UPDATE_PERSON,
  );

  const handleBack = useLogoutOnBack(true, !!personId);

  const saveAndNavigateNext = async () => {
    Keyboard.dismiss();
    if (!firstName) {
      return;
    }
    try {
      setIsLoading(true);
      if (personId) {
        const { data } = await updatePerson({
          variables: {
            input: {
              id: personId,
              firstName,
              lastName,
              relationshipType,
            },
          },
        });
        data?.updatePerson?.person &&
          dispatch({
            type: LOAD_PERSON_DETAILS,
            person: {
              first_name: data?.updatePerson?.person.firstName,
              id: data?.updatePerson?.person.id,
            },
          });
        dispatch(next({ personId }));
      } else if (isMe) {
        const { id } = ((await dispatch(
          createMyPerson(firstName, lastName),
        )) as unknown) as { id: string };
        dispatch(next({ personId: id }));
      } else {
        const { data } = await createPerson({
          variables: {
            input: {
              firstName,
              lastName,
              relationshipType,
              assignToMe: true,
            },
          },
        });

        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
        data?.createPerson?.person &&
          dispatch({
            type: LOAD_PERSON_DETAILS,
            person: {
              first_name: data?.createPerson?.person.firstName,
              id: data?.createPerson?.person.id,
            },
          });
        data?.createPerson?.person &&
          dispatch(next({ personId: data?.createPerson?.person.id }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onFirstNameSubmitEditing = () =>
    lastNameRef.current && lastNameRef.current.focus();

  const skip = () => {
    dispatch(next({ skip: true }));
  };

  return (
    <View style={styles.container}>
      <Header
        left={<BackButton customNavigate={isMe ? handleBack : undefined} />}
        right={isMe || hideSkipBtn ? null : <Skip onSkip={skip} />}
      />
      <Flex value={2} justify="end" align="center">
        {isMe ? (
          <Text header={true} style={styles.header}>
            {t('namePrompt')}
          </Text>
        ) : (
          <>
            <View style={styles.textWrap}>
              <Text style={styles.addPersonText}>{t('addPerson.part1')}</Text>
              <Text style={styles.addPersonText}>{t('addPerson.part2')}</Text>
              <Text style={styles.addPersonText}>{t('addPerson.part3')}</Text>
            </View>
          </>
        )}
      </Flex>

      <View style={styles.inputWrap}>
        <View>
          <Text style={styles.label}>
            {isMe
              ? t('profileLabels.firstNameRequired')
              : t('profileLabels.firstNameNickname')}
          </Text>
          <Input
            onChangeText={(firstName: string) => setFirstName(firstName)}
            value={firstName}
            autoFocus={true}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={onFirstNameSubmitEditing}
            placeholder={t('profileLabels.firstName')}
            placeholderTextColor="white"
            testID="InputFirstName"
          />
        </View>
        <View style={{ paddingVertical: 30 }}>
          <Input
            ref={lastNameRef}
            onChangeText={(lastName: string) => setLastName(lastName)}
            value={lastName}
            returnKeyType="done"
            placeholder={
              isMe
                ? t('profileLabels.lastName')
                : t('profileLabels.lastNameOptional')
            }
            placeholderTextColor="white"
            blurOnSubmit={true}
            onSubmitEditing={saveAndNavigateNext}
            testID="InputLastName"
          />
        </View>
        {isMe ? <TosPrivacy trial={true} /> : null}
      </View>
      <BottomButton
        testID="SaveBottomButton"
        disabled={isLoading}
        onPress={saveAndNavigateNext}
        text={t('continue')}
      />
    </View>
  );
};
const mapStateToProps = (
  {
    auth,
    onboarding: { personId },
    people,
  }: { auth: AuthState; onboarding: OnboardingState; people: PeopleState },
  {
    isMe,
  }: {
    isMe: boolean;
  },
) => ({
  isMe,
  ...(isMe
    ? {
        loadedFirstName: auth.person.first_name,
        loadedLastName: auth.person.last_name,
        personId: auth.person.id,
      }
    : {
        loadedFirstName: (personSelector({ people }, { personId }) || {})
          .first_name,
        loadedLastName: (personSelector({ people }, { personId }) || {})
          .last_name,
        personId,
      }),
});
export default connect(mapStateToProps)(SetupScreen);
export const SETUP_SCREEN = 'nav/SETUP';
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON_SCREEN';
