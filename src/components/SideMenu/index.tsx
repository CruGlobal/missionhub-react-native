import React, { useEffect } from 'react';
import { SafeAreaView, BackHandler } from 'react-native';
import { connect } from 'react-redux-legacy';
import { DrawerActions } from 'react-navigation-drawer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Flex, Button, IconButton } from '../common';
import { DrawerState } from '../../reducers/drawer';
import { MAIN_MENU_DRAWER, PERSON_MENU_DRAWER } from '../../constants';

import styles from './styles';

interface MenuItemsType {
  label: string;
  action: () => void;
  selected?: boolean;
}

interface SideMenuProps {
  isOpen: boolean;
  dispatch: ThunkDispatch<{}, null, AnyAction>;
  menuItems: MenuItemsType[];
  menuName: string;
  testID?: string;
}

const SideMenu = ({ isOpen, dispatch, menuItems, menuName }: SideMenuProps) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const onBackPress = () => {
    if (isOpen) {
      dispatch(DrawerActions.closeDrawer({ drawer: menuName }));
      return true;
    }

    return false;
  };

  const closeDrawer = () =>
    dispatch(DrawerActions.closeDrawer({ drawer: menuName }));

  return (
    <SafeAreaView style={styles.background}>
      <Flex style={styles.buttonContainer}>
        <IconButton
          testID="CloseButton"
          style={styles.button}
          onPress={closeDrawer}
          name="close"
          type="Material"
          size={20}
        />
      </Flex>
      {menuItems.map(({ label, action, selected }) => (
        <Flex key={label} style={styles.buttonContainer}>
          <Button
            style={styles.button}
            buttonTextStyle={[
              styles.buttonText,
              selected && styles.buttonTextSelected,
            ]}
            text={label.toUpperCase()}
            onPress={action}
          />
        </Flex>
      ))}
    </SafeAreaView>
  );
};

const mapStateToProps = (
  { drawer }: { drawer: DrawerState },
  { menuName }: { menuName: string },
) => {
  const {
    menuIsOpen: { mainMenu, personMenu },
  } = drawer;

  return {
    isOpen:
      menuName === MAIN_MENU_DRAWER
        ? mainMenu
        : menuName === PERSON_MENU_DRAWER
        ? personMenu
        : false,
  };
};

export default connect(mapStateToProps)(SideMenu);
