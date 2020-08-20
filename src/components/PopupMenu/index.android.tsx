import React, { Component } from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import Menu, { MenuItem } from 'react-native-material-menu';

import KebabIcon from '../../../assets/images/kebabIcon.svg';
import { Touchable } from '../common';
import { TouchableIOSProps } from '../Touchable/index.ios';
import { TouchableAndroidProps } from '../Touchable/index.android';

import styles from './styles';

interface PopupMenuProps {
  title?: string;
  actions: {
    text: string;
    onPress: () => void;
    destructive?: boolean;
  }[];
  buttonProps?: Partial<TouchableIOSProps> & Partial<TouchableAndroidProps>;
  disabled?: boolean;
  triggerOnLongPress?: boolean;
  iconColor?: string;
  testID?: string;
}

// Android only component
class PopupMenu extends Component<PopupMenuProps> {
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
      disabled,
      triggerOnLongPress,
      buttonProps = { style: undefined },
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
      <Touchable
        testID="popupMenuButton"
        disabled={disabled}
        {...buttonProps}
        {...(triggerOnLongPress
          ? { onLongPress: this.showMenu }
          : { onPress: this.showMenu })}
        style={[styles.container, buttonProps.style]}
      >
        <KebabIcon />
      </Touchable>
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
