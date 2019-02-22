import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DrawerActions } from 'react-navigation';

import { Flex, Button, IconButton, SafeView } from '../common';

import styles from './styles';

export class SideMenu extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (this.props.isOpen) {
      this.props.dispatch(DrawerActions.closeDrawer());
      return true;
    }

    return false;
  };

  closeDrawer = () => this.props.dispatch(DrawerActions.closeDrawer());

  render() {
    const { menuItems } = this.props;
    return (
      <SafeView style={styles.background}>
        <Flex style={styles.buttonContainer}>
          <IconButton
            style={styles.button}
            onPress={this.closeDrawer}
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
      </SafeView>
    );
  }
}

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
