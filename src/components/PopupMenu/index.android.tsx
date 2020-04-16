import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import Menu, { MenuItem } from 'react-native-material-menu';

import { IconButton, Touchable } from '../common';

import styles from './styles';

// Android only component
class PopupMenu extends Component {
  // @ts-ignore
  ref = c => (this.menu = c);

  // @ts-ignore
  showMenu = () => this.menu.show();

  // @ts-ignore
  hideMenu = () => this.menu.hide();

  // @ts-ignore
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
      // @ts-ignore
      disabled,
      // @ts-ignore
      triggerOnLongPress,
      // @ts-ignore
      buttonProps = {},
      // @ts-ignore
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
    // @ts-ignore
    const { actions } = this.props;

    return (
      <Menu ref={this.ref} button={this.renderMenuTrigger()}>
        {actions.map(this.renderItem)}
      </Menu>
    );
  }
}

// @ts-ignore
PopupMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
    }),
  ).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  disabled: PropTypes.bool,
  triggerOnLongPress: PropTypes.bool,
  buttonProps: PropTypes.object,
  iconProps: PropTypes.object,
};

export default PopupMenu;
