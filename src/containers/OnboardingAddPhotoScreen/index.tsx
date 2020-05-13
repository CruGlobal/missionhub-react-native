import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';

import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import Skip from '../../components/Skip';
import theme from '../../theme';
import BackButton from '../BackButton';

interface OnboardingAddPhotoScreenProps {
  next: ({
    skip,
  }: {
    skip: boolean;
  }) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

export const OnboardingAddPhotoScreen = ({
  next,
}: OnboardingAddPhotoScreenProps) => {
  const dispatch = useDispatch();

  const handleNext = () => dispatch(next({ skip: false }));

  const handleSkip = () => dispatch(next({ skip: true }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryColor }}>
      <Header left={<BackButton />} right={<Skip onSkip={handleSkip} />} />
      <BottomButton onPress={handleNext} text={'Next'} />
    </View>
  );
};

export const ONBOARDING_ADD_PHOTO_SCREEN = 'nav/ONBOARDING_ADD_PHOTO_SCREEN';
