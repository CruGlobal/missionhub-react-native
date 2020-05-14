import React from 'react';
import { View, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import BackButton from '../../components/BackButton';
import BottomButton from '../../components/BottomButton';
import { Text, Button } from '../../components/common';
import Header from '../../components/Header';
import ADD_SOMEONE from '../../../assets/images/add_someone.png';

import styles from './styles';

interface OnboardingPhotoConfirmProps {
  next: () => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

export const OnboardingPhotoConfirmScreen = ({
  next,
}: OnboardingPhotoConfirmProps) => {
  const { t } = useTranslation('onboardingConfirmPhoto');
  const dispatch = useDispatch();

  const handleChangePhoto = () => {};

  const handleNext = () => dispatch(next());

  return (
    <View style={styles.container}>
      <Header left={<BackButton style={styles.headerButton} />} />
      <View style={styles.contentWrap}>
        <Image source={ADD_SOMEONE} style={styles.image} resizeMode="contain" />
        <Text style={styles.headerText}>{t('header')}</Text>
        <Button
          onPress={handleChangePhoto}
          type="transparent"
          text={t('changePhoto')}
          style={styles.changePhotoButton}
          buttonTextStyle={styles.changePhotoText}
        />
        <Button
          type="secondary"
          pill={true}
          onPress={handleNext}
          text={t('continue').toUpperCase()}
          style={styles.bottomButtonWrapper}
          buttonTextStyle={styles.bottomButtonText}
        />
      </View>
    </View>
  );
};

export const ONBOARDING_PHOTO_CONFIRM_SCREEN =
  'nav/ONBOARDING_PHOTO_CONFIRM_SCREEN';
