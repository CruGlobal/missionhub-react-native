import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';

import { IconButton, Touchable } from '../common';

import styles from './styles';

// Android only component
class PopupMenu extends Component {
  ref = c => (this.menu = c);

  showMenu = () => this.menu.show();

  hideMenu = () => this.menu.hide();

  renderItem = ({ text, onPress }) => {
    const handlePress = () => {
      this.hideMenu();
      onPress();
    };

    return <MenuItem onPress={handlePress}>{text}</MenuItem>;
  };

  renderMenuTrigger = () => {
    const {
      children,
      disabled,
      triggerOnLongPress,
      buttonProps = {},
      iconProps = {},
    } = this.props;

    return children ? (
      <Touchable
        disabled={disabled}
        {...buttonProps}
        {...(triggerOnLongPress
          ? { onLongPress: this.showMenu }
          : { onPress: this.showMenu })}
        testID="popupMenuButton"
      >
        {children}
      </Touchable>
    ) : (
      <IconButton
        type="MissionHub"
        disabled={disabled}
        {...buttonProps}
        {...iconProps}
        {...(triggerOnLongPress
          ? { onLongPress: this.showMenu }
          : { onPress: this.showMenu })}
        ref={this.ref}
        testID="popupMenuButton"
        name="moreIcon"
        buttonStyle={[styles.container, buttonProps.style]}
        style={[styles.icon, iconProps.style]}
      />
    );
  };

  render() {
    const { actions } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Menu ref={this.ref} button={this.renderMenuTrigger()}>
          {actions.map(this.renderItem)}
        </Menu>
      </View>
    );
  }
}

PopupMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
    }),
  ).isRequired,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  triggerOnLongPress: PropTypes.bool,
  buttonProps: PropTypes.object,
  iconProps: PropTypes.object,
};

export default PopupMenu;
