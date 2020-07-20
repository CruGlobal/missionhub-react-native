import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerActions } from 'react-navigation-drawer';
import { SafeAreaView, BackHandler, View } from 'react-native';

import { useGetAppVersion } from '../../utils/hooks/useGetAppVersion';
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
import { logout } from '../../actions/auth/auth';
import theme from '../../theme';

import { GET_MY_AVATAR_AND_EMAIL } from './queries';
import { GetMyAvatarAndEmail } from './__generated__/GetMyAvatarAndEmail';
import styles from './styles';

export interface MenuItemsType {
  id: string;
  title: string;
  data: { label: string; action: () => void; selected?: boolean }[];
}

interface SideMenuProps {
  menuItems: MenuItemsType[];
  testID?: string;
}

const SideMenu = ({ menuItems }: SideMenuProps) => {
  const { t } = useTranslation('settingsMenu');
  const dispatch = useDispatch();
  const myId = useMyId();

  const isSignedIn = useSelector(
    ({ auth }: { auth: AuthState }) => !auth.upgradeToken,
  );

  const appVersion = useGetAppVersion();
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

  const onEditProfile = () =>
    dispatch(
      navigatePush(EDIT_PERSON_FLOW, {
        person: { id: myId },
      }),
    );

  const onHandleAppUpdate = () => {
    return;
  };

  const handleSignOut = () => dispatch(logout());

  const handleSignIn = () => dispatch(navigatePush(SIGN_IN_FLOW));

  const handleSignUp = () => dispatch(navigatePush(SIGN_UP_FLOW));

  return (
    <SafeAreaView style={styles.background}>
      <View style={styles.closeContainer}>
        <CloseButton />
        <Button onPress={onEditProfile}>
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
          {section?.data.map(({ label, action, selected }) => (
            <Button
              style={styles.button}
              buttonTextStyle={[
                styles.buttonText,
                selected && styles.buttonTextSelected,
              ]}
              text={label}
              onPress={action}
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
        )} ${appVersion}`}</Text>
        {false ? (
          <Button
            style={styles.updateButton}
            buttonTextStyle={[styles.updateText]}
            text={t('update')}
            onPress={onHandleAppUpdate}
            pill={true}
          ></Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default SideMenu;
