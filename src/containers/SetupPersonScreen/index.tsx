import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Keyboard, Image, TextInput } from 'react-native';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
import { AndroidBackHandler } from 'react-navigation-backhandler';

import { BackButton } from '../BackButton';
import { Text, Flex } from '../../components/common';
import BottomButton from '../../components/BottomButton';
import Input from '../../components/Input/index';
import AbsoluteSkip from '../../components/AbsoluteSkip';
import { trackActionWithoutData } from '../../actions/analytics';
import { navigateBack } from '../../actions/navigation';
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
  const { t } = useTranslation('profileLabels');
  const [isLoading, setIsLoading] = useState(false);
  const lastNameRef = useRef<TextInput>(null);

  const navigateNext = (skip = false) => dispatch(next({ skip, personId: id }));

  const savePerson = async () => {
    Keyboard.dismiss();
    if (!firstName) {
      return;
    }
    try {
      setIsLoading(true);
      if (id) {
        await dispatch(updateOnboardingPerson({ id, firstName, lastName }));
      } else {
        await dispatch(createPerson(firstName, lastName, myId));
        dispatch(trackActionWithoutData(ACTIONS.PERSON_ADDED));
      }
    } finally {
      navigateNext();
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

  const handleBack = () => {
    dispatch(navigateBack());
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Flex value={1} />
      <Flex value={2} align="center">
        <Image source={require('../../../assets/images/add_someone.png')} />
      </Flex>

      <Flex value={3} style={{ padding: 30 }}>
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
            placeholder={t('firstName')}
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
            placeholder={t('lastNameOptional')}
            placeholderTextColor="white"
            blurOnSubmit={true}
            onSubmitEditing={savePerson}
          />
        </View>
      </Flex>
      <BottomButton
        onPress={savePerson}
        text={t('next')}
        disabled={isLoading}
      />
      <AbsoluteSkip onSkip={skip} />
      <BackButton absolute={true} />
      <AndroidBackHandler onBackPress={handleBack} />
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
