import React from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';

import BackButton from '../../components/BackButton';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import theme from '../../theme';

interface OnboardingPhotoConfirmProps {
  next: () => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

export const OnboardingPhotoConfirmScreen = ({
  next,
}: OnboardingPhotoConfirmProps) => {
  const dispatch = useDispatch();

  const handlePress = () => dispatch(next());

  return (
    <View style={{ flex: 1, backgroundColor: theme.primaryColor }}>
      <Header left={<BackButton />} />
      <BottomButton onPress={handlePress} text={'Next'} />
    </View>
  );
};

export const ONBOARDING_PHOTO_CONFIRM_SCREEN =
  'nav/ONBOARDING_PHOTO_CONFIRM_SCREEN';
