import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ActionSheetIOS, ViewStyle, StyleProp } from 'react-native';
import i18next from 'i18next';

import { IconButton, Touchable } from '../common';
import { isFunction } from '../../utils/common';
import { IconProps } from '../Icon';
import { ButtonProps } from '../Button';

import styles from './styles';

interface PopupMenuProps {
  title?: string;
  actions: {
    text: string;
    onPress: () => void;
    destructive?: boolean;
  }[];
  iconProps?: Omit<IconProps, 'name' | 'type'> & StyleProp<ViewStyle>;
  buttonProps?: ButtonProps & StyleProp<ViewStyle>;
  disabled?: boolean;
  triggerOnLongPress?: boolean;
}

// iOS only component
//@ts-ignore
@withTranslation()
class PopupMenu extends Component<PopupMenuProps & Partial<i18next.WithT>> {
  showMenu = () => {
    const { actions, t, title } = this.props;

    const options = actions.map(a => a.text).concat(t('cancel'));
    const select = (i: number) =>
      actions[i] && isFunction(actions[i].onPress) && actions[i].onPress();

    let destructiveButtonIndex: number | undefined = actions.findIndex(
      o => o.destructive,
    );
    if (destructiveButtonIndex < 0) {
      destructiveButtonIndex = undefined;
    }

    const params = {
      options,
      cancelButtonIndex: options.length - 1,
      destructiveButtonIndex,
      ...(title ? { title } : {}),
    };

    ActionSheetIOS.showActionSheetWithOptions(params, btnIndex =>
      select(btnIndex),
    );
  };

  render() {
    const {
      children,
      disabled,
      triggerOnLongPress,
      buttonProps = { style: undefined },
      iconProps = { style: undefined },
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
        name="moreIcon"
        testID="popupMenuButton"
        buttonStyle={[styles.container, buttonProps.style]}
        style={[styles.icon, iconProps.style]}
        onPress={this.showMenu}
      />
    );
  }
}

// @ts-ignore
PopupMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
      destructive: PropTypes.bool,
    }),
  ).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  disabled: PropTypes.bool,
  triggerOnLongPress: PropTypes.bool,
  title: PropTypes.string,
  buttonProps: PropTypes.object,
  iconProps: PropTypes.object,
};

export default PopupMenu;
