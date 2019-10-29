import React, { useEffect } from 'react';
import { SafeAreaView, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { DrawerActions } from 'react-navigation';
import { ThunkDispatch } from 'redux-thunk';

import { Flex, Button, IconButton } from '../common';

import styles from './styles';

interface SideMenuProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: ThunkDispatch<any, null, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuItems: any;
}

const SideMenu = ({ isOpen, dispatch, menuItems }: SideMenuProps) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
  }, []);

  useEffect(() => {
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
          style={styles.button}
          onPress={closeDrawer}
          name="close"
          type="Material"
          size={20}
        />
      </Flex>
      {menuItems.map(
        ({
          label,
          action,
          selected,
        }: {
          label: string;
          action: () => void;
          selected: boolean;
        }) => (
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
        ),
      )}
    </SafeAreaView>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = ({ drawer }: any) => ({ isOpen: drawer.isOpen });

export default connect(mapStateToProps)(SideMenu);
