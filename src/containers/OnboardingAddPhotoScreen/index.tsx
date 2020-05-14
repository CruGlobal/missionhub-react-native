import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import { Text } from '../../components/common';
import Header from '../../components/Header';
import Skip from '../../components/Skip';
import BackButton from '../BackButton';
import ImagePicker, { SelectImageParams } from '../../components/ImagePicker';

import ProfileIcon from './ProfileIcon.svg';
import ProfileAddIcon from './ProfileAddIcon.svg';
import styles from './styles';

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
  const { t } = useTranslation('onboardingAddPhoto');
  const dispatch = useDispatch();

  const handleNext = () => dispatch(next({ skip: false }));

  const handleSkip = () => dispatch(next({ skip: true }));

  const handleSelectImage = (image: SelectImageParams) => {};

  return (
    <View style={styles.container}>
      <Header
        left={<BackButton style={{ borderWidth: 1 }} />}
        right={<Skip onSkip={handleSkip} />}
      />
      <View style={styles.contentWrap}>
        <Text style={styles.headerText}>{t('header')}</Text>
        <Text style={styles.descriptionText}>{t('description')}</Text>
        <View>
          <ProfileIcon style={styles.profileIcon} />
          <ProfileAddIcon style={styles.profileAddIcon} />
        </View>
      </View>
      <SafeAreaView style={{ position: 'absolute', bottom: 20, left: 50 }}>
        <ImagePicker onSelectImage={handleSelectImage}>
          <View style={styles.bottomButtonText}>
            <Text style={styles.bottomButtonText}>
              {t('buttonText').toUpperCase()}
            </Text>
          </View>
        </ImagePicker>
      </SafeAreaView>
    </View>
  );
};

export const ONBOARDING_ADD_PHOTO_SCREEN = 'nav/ONBOARDING_ADD_PHOTO_SCREEN';
