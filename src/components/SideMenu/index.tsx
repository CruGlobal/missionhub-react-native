import React, { useEffect } from 'react';
import { SafeAreaView, BackHandler } from 'react-native';
import { connect } from 'react-redux-legacy';
import { DrawerActions } from 'react-navigation-drawer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { Flex, Button, IconButton } from '../common';

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
  testID?: string;
}

const SideMenu = ({ isOpen, dispatch, menuItems }: SideMenuProps) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const onBackPress = () => {
    if (isOpen) {
      dispatch(DrawerActions.closeDrawer());
      return true;
    }

    return false;
  };

  const closeDrawer = () => dispatch(DrawerActions.closeDrawer());

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

const mapStateToProps = ({ drawer }: { drawer: { isOpen: boolean } }) => ({
  isOpen: drawer.isOpen,
});

export default connect(mapStateToProps)(SideMenu);
