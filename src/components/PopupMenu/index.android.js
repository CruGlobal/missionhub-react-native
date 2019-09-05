import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
      containerStyle,
      children,
      disabled,
      triggerOnLongPress,
      iconStyle,
    } = this.props;

    return children ? (
      <Touchable
        isAndroidOpacity={true}
        disabled={disabled}
        {...(triggerOnLongPress
          ? { onLongPress: this.showMenu }
          : { onPress: this.showMenu })}
      >
        {children}
      </Touchable>
    ) : (
      <IconButton
        ref={this.ref}
        name="moreIcon"
        type="MissionHub"
        buttonStyle={[styles.container, containerStyle]}
        style={[styles.icon, iconStyle]}
        disabled={disabled}
        onPress={this.showMenu}
      />
    );
  };

  render() {
    const { actions } = this.props;

    return (
      <Menu ref={this.ref} button={this.renderMenuTrigger()}>
        {actions.map(this.renderItem)}
      </Menu>
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
  containerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  iconStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default PopupMenu;
