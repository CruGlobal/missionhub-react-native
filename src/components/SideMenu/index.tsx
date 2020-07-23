import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerActions } from 'react-navigation-drawer';
import { SafeAreaView, BackHandler, View, Linking, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { useCheckForUpdate } from '../../utils/hooks/useCheckForUpdate';
import { useMyId } from '../../utils/hooks/useIsMe';
import { useIsDrawerOpen } from '../../utils/hooks/useIsDrawerOpen';
import Avatar from '../Avatar';
import { Button, Text } from '../common';
import { AuthState } from '../../reducers/auth';
import CloseButton from '../CloseButton';
import EditIcon from '../../../assets/images/editIcon.svg';
import { navigatePush } from '../../actions/navigation';
import {
  EDIT_PERSON_FLOW,
  SIGN_IN_FLOW,
  SIGN_UP_FLOW,
} from '../../routes/constants';
import { LINKS } from '../../constants';
import { isAndroid } from '../../utils/common';
import { logout } from '../../actions/auth/auth';
import {
  ANALYTICS_SCREEN_TYPES,
  useAnalytics,
} from '../../utils/hooks/useAnalytics';
import theme from '../../theme';

import { GET_MY_AVATAR_AND_EMAIL } from './queries';
import { GetMyAvatarAndEmail } from './__generated__/GetMyAvatarAndEmail';
import styles from './styles';

const SideMenu = () => {
  useAnalytics('menu', { screenType: ANALYTICS_SCREEN_TYPES.drawer });
  const { t } = useTranslation('sideMenu');
  const dispatch = useDispatch();
  const myId = useMyId();

  const isSignedIn = useSelector(
    ({ auth }: { auth: AuthState }) => !auth.upgradeToken,
  );

  const needsToUpdate = useCheckForUpdate();
  const isOpen = useIsDrawerOpen();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const { data: { currentUser: { person = undefined } = {} } = {} } = useQuery<
    GetMyAvatarAndEmail
  >(GET_MY_AVATAR_AND_EMAIL);

  const personEmail =
    person?.emailAddressesList[0] && person.emailAddressesList[0].email;

  const onBackPress = () => {
    if (isOpen) {
      dispatch(DrawerActions.closeDrawer());
      return true;
    }

    return false;
  };

  const openUrl = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      // Can't handle url
      Alert.alert(t('cannotOpenUrl'), t('pleaseVisit', { url }));
      return;
    }

    Linking.openURL(url);
  };

  const onEditProfile = () =>
    dispatch(
      navigatePush(EDIT_PERSON_FLOW, {
        person: { id: myId },
      }),
    );

  const onHandleOpenStore = () => {
    // Open link to app or play store
    return openUrl(isAndroid ? LINKS.playStore : LINKS.appleStore);
  };

  const closeDrawer = () => dispatch(DrawerActions.closeDrawer());

  const handleSignOut = () => dispatch(logout());

  const handleSignIn = () => dispatch(navigatePush(SIGN_IN_FLOW));

  const handleSignUp = () => dispatch(navigatePush(SIGN_UP_FLOW));

  const menuItems = [
    {
      id: '1',
      title: t('feedBack'),
      data: [
        {
          label: t('shareStory'),
          action: () => openUrl(LINKS.shareStory),
        },
        {
          label: t('suggestStep'),
          action: () => openUrl(LINKS.shareStory),
        },
        {
          label: t('review'),
          action: () => onHandleOpenStore(),
        },
      ],
    },

    {
      id: '2',
      title: t('about'),
      data: [
        {
          label: t('blog'),
          action: () => openUrl(LINKS.blog),
        },
        {
          label: t('website'),
          action: () => openUrl(LINKS.about),
        },
        {
          label: t('help'),
          action: () => openUrl(LINKS.help),
        },

        {
          label: t('privacy'),
          action: () => openUrl(LINKS.privacy),
        },
        {
          label: t('tos'),
          action: () => openUrl(LINKS.terms),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.closeContainer}>
        <CloseButton customNavigate={closeDrawer} />
        <Button onPress={onEditProfile} testID="editButton">
          <EditIcon color={theme.lightGrey} />
        </Button>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Avatar person={person} size={'medium'} />
          <View style={styles.personInfoContainer}>
            <Text style={styles.personName}>{person?.fullName}</Text>
            <Text style={styles.personEmail}>{personEmail}</Text>
          </View>
        </View>
        {!isSignedIn ? (
          <View style={styles.notSignedInContainer}>
            <Button
              style={styles.notSignedInButton}
              buttonTextStyle={styles.buttonText}
              text={t('signIn')}
              onPress={handleSignIn}
              pill={true}
            />
            <Button
              style={styles.notSignedInButton}
              buttonTextStyle={styles.buttonText}
              text={t('createAccount')}
              onPress={handleSignUp}
              pill={true}
            />
          </View>
        ) : null}
      </View>
      {menuItems.map(section => (
        <View style={styles.sectionContainer} key={section.id}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section?.data.map(({ label, action }) => (
            <Button
              style={styles.button}
              buttonTextStyle={[styles.buttonText]}
              text={label}
              onPress={action}
              key={label}
            />
          ))}
        </View>
      ))}
      {isSignedIn ? (
        <Text style={styles.signOutText} onPress={handleSignOut}>
          {t('signOut')}
        </Text>
      ) : null}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{`${t(
          'version',
        )} ${DeviceInfo.getVersion()}`}</Text>
        {needsToUpdate ? (
          <Button
            testID="updateButton"
            style={styles.updateButton}
            buttonTextStyle={[styles.updateText]}
            text={t('update')}
            onPress={onHandleOpenStore}
            pill={true}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default SideMenu;
