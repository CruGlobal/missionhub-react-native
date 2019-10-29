import React, { Component, useEffect } from 'react';
import { SafeAreaView, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DrawerActions } from 'react-navigation';

import { Flex, Button, IconButton } from '../common';

import styles from './styles';

const SideMenu = ({ isOpen, dispatch, menuItems }) => {
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

SideMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      action: PropTypes.func,
    }),
  ),
};

const mapStateToProps = ({ drawer }) => ({ isOpen: drawer.isOpen });

export default connect(mapStateToProps)(SideMenu);
