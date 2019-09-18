import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Keyboard, Image, TextInput } from 'react-native';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { BackButton } from '../BackButton';
import { Text } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import Input from '../../components/Input/index';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import { trackActionWithoutData } from '../../actions/analytics';
import {
  personFirstNameChanged,
  personLastNameChanged,
  createPerson,
  updateOnboardingPerson,
} from '../../actions/onboardingProfile';
import { ACTIONS } from '../../constants';
import { PersonProfileState } from '../../reducers/personProfile';
import { AuthState } from '../../reducers/auth';

import styles from './styles';

interface SetupPersonScreenProps {
  next: (props: {
    skip: boolean;
    personId: string | null;
  }) => ThunkAction<unknown, {}, {}, AnyAction>;
  id: string | null;
  firstName: string;
  lastName: string;
  myId: string;
  dispatch: ThunkDispatch<{}, {}, AnyAction>;
}

const SetupPersonScreen = ({
  next,
  id,
  firstName,
  lastName,
  myId,
  dispatch,
}: SetupPersonScreenProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const lastNameRef = useRef<TextInput>(null);

  const navigateNext = (skip = false, newPersonId = null) => {
    const personId = newPersonId || id;
    dispatch(next({ skip, personId }));
  };

  const savePerson = async () => {
    Keyboard.dismiss();
    if (!firstName) {
      return;
    }
    try {
      setIsLoading(true);
      if (id) {
        await dispatch(updateOnboardingPerson({ id, firstName, lastName }));
        navigateNext();
      } else {
        const {
          response: { id: newPersonId },
        } = await dispatch(createPerson(firstName, lastName, myId));
        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
        navigateNext(false, newPersonId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onFirstNameSubmitEditing = () =>
    lastNameRef.current && lastNameRef.current.focus();

  const updateFirstName = (name: string) =>
    dispatch(personFirstNameChanged(name));

  const updateLastName = (name: string) =>
    dispatch(personLastNameChanged(name));

  const skip = () => navigateNext(true);

  return (
    <SafeAreaView style={styles.container}>
      <AbsoluteSkip onSkip={skip} />
      <BackButton absolute={true} />
      <View style={{ flex: 1 }} />
      <View style={styles.imageWrap}>
        <Image source={require('../../../assets/images/add_someone.png')} />
      </View>
      <View style={styles.inputWrap}>
        <View>
          <Text style={styles.label}>
            {t('profileLabels.firstNameNickname')}
          </Text>
          <Input
            testID={'firstNameInput'}
            onChangeText={updateFirstName}
            value={firstName}
            autoFocus={true}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={onFirstNameSubmitEditing}
            placeholder={t('profileLabels.firstName')}
            placeholderTextColor="white"
          />
        </View>
        <View style={{ paddingTop: 30 }}>
          <Input
            testID={'lastNameInput'}
            ref={lastNameRef}
            onChangeText={updateLastName}
            value={lastName}
            returnKeyType="next"
            placeholder={t('profileLabels.lastNameOptional')}
            placeholderTextColor="white"
            blurOnSubmit={true}
            onSubmitEditing={savePerson}
          />
        </View>
      </View>
      <BottomButton
        onPress={savePerson}
        text={t('next')}
        disabled={isLoading}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = ({
  auth,
  personProfile,
}: {
  auth: AuthState;
  personProfile: PersonProfileState;
}) => ({
  id: personProfile.id,
  firstName: personProfile.personFirstName,
  lastName: personProfile.personLastName,
  myId: auth.person.id,
});

export default connect(mapStateToProps)(SetupPersonScreen);
export const SETUP_PERSON_SCREEN = 'nav/SETUP_PERSON';
