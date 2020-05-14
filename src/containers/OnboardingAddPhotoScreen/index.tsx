import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import BackButton from '../../components/BackButton';
import { Text } from '../../components/common';
import Header from '../../components/Header';
import Skip from '../../components/Skip';
import ImagePicker, { SelectImageParams } from '../../components/ImagePicker';

import ProfileIcon from './ProfileIcon.svg';
import ProfilePlusIcon from './ProfilePlusIcon.svg';
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
      <View style={styles.profileIconWrap}>
        <ProfileIcon style={styles.profileIcon} />
        <ProfilePlusIcon style={styles.profilePlusIcon} />
      </View>
      <Header
        left={<BackButton style={styles.headerButton} />}
        right={
          <Skip
            onSkip={handleSkip}
            style={styles.headerButton}
            textStyle={styles.skipText}
          />
        }
      />
      <View style={styles.contentWrap}>
        <Text style={styles.headerText}>{t('header')}</Text>
        <Text style={styles.descriptionText}>{t('description')}</Text>
      </View>
      <SafeAreaView style={{ position: 'absolute', bottom: 20, left: 50 }}>
        <ImagePicker onSelectImage={handleSelectImage}>
          <View style={styles.bottomButtonWrapper}>
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
