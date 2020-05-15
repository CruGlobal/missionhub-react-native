import React, { useState } from 'react';
import { View, SafeAreaView, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import BackButton from '../../components/BackButton';
import { Text, Button } from '../../components/common';
import Header from '../../components/Header';
import Skip from '../../components/Skip';
import ImagePicker, { SelectImageParams } from '../../components/ImagePicker';
import {
  UpdatePerson,
  UpdatePersonVariables,
} from '../SetupScreen/__generated__/UpdatePerson';
import { UPDATE_PERSON } from '../SetupScreen/queries';

import ProfileIcon from './ProfileIcon.svg';
import ProfilePlusIcon from './ProfilePlusIcon.svg';
import styles from './styles';
import { GetMe } from './__generated__/GetMe';

export const GET_ME = gql`
  query GetMe {
    currentUser {
      person {
        id
      }
    }
  }
`;

interface OnboardingAddPhotoScreenProps {
  next: () => // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ThunkAction<void, any, null, never>;
}

export const OnboardingAddPhotoScreen = ({
  next,
}: OnboardingAddPhotoScreenProps) => {
  const { t } = useTranslation('onboardingAddPhoto');
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [updatePerson] = useMutation<UpdatePerson, UpdatePersonVariables>(
    UPDATE_PERSON,
  );
  const {
    data: { currentUser: { person: { id: myId = null } = {} } = {} } = {},
  } = useQuery<GetMe>(GET_ME);

  const handleNext = () => dispatch(next());

  const saveImage = () => {
    myId &&
      updatePerson({
        variables: { input: { id: myId, picture: profileImage } },
      });
    handleNext();
  };

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
            onSkip={handleNext}
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
            onPress={saveImage}
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
