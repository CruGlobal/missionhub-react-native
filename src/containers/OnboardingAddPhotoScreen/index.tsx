import React, { useState } from 'react';
import { View, SafeAreaView, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';

import BackButton from '../../components/BackButton';
import { Text, Button } from '../../components/common';
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
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleNext = () => dispatch(next({ skip: false }));

  const handleSkip = () => dispatch(next({ skip: true }));

  const handleSelectImage = ({ data }: SelectImageParams) => {
    setProfileImage(data);
  };

  const renderNull = () => (
    <>
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
        <Text style={styles.nullHeaderText}>{t('nullHeader')}</Text>
        <Text style={styles.descriptionText}>{t('description')}</Text>
      </View>
      <SafeAreaView style={{ position: 'absolute', bottom: 20, left: 50 }}>
        <ImagePicker onSelectImage={handleSelectImage}>
          <View style={styles.nullBottomButtonWrapper}>
            <Text style={styles.bottomButtonText}>
              {t('nullButtonText').toUpperCase()}
            </Text>
          </View>
        </ImagePicker>
      </SafeAreaView>
    </>
  );

  const renderWithImage = () =>
    profileImage ? (
      <>
        <Header left={<BackButton style={styles.headerButton} />} />
        <View style={styles.contentWrap}>
          <Image
            source={{ uri: profileImage }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.imageHeaderText}>{t('imageHeader')}</Text>
          <ImagePicker onSelectImage={handleSelectImage}>
            <View style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>{t('changePhoto')}</Text>
            </View>
          </ImagePicker>
          <Button
            type="secondary"
            pill={true}
            onPress={handleNext}
            text={t('imageButtonText').toUpperCase()}
            style={styles.imageBottomButtonWrapper}
            buttonTextStyle={styles.bottomButtonText}
          />
        </View>
      </>
    ) : null;

  return (
    <View style={styles.container}>
      {profileImage ? renderWithImage() : renderNull()}
    </View>
  );
};

export const ONBOARDING_ADD_PHOTO_SCREEN = 'nav/ONBOARDING_ADD_PHOTO_SCREEN';
