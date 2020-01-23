import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ActionSheetIOS } from 'react-native';

import { IconButton, Touchable } from '../common';
import { isFunction } from '../../utils/common';

import styles from './styles';

// iOS only component
// @ts-ignore
@withTranslation()
class PopupMenu extends Component {
  showMenu = () => {
    // @ts-ignore
    const { actions, t, title } = this.props;

    // @ts-ignore
    const options = actions.map(a => a.text).concat(t('cancel'));
    // @ts-ignore
    const select = i =>
      actions[i] && isFunction(actions[i].onPress) && actions[i].onPress();

    // @ts-ignore
    let destructiveButtonIndex = actions.findIndex(o => o.destructive);
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
  children: PropTypes.element,
  disabled: PropTypes.bool,
  triggerOnLongPress: PropTypes.bool,
  title: PropTypes.string,
  buttonProps: PropTypes.object,
  iconProps: PropTypes.object,
};

export default PopupMenu;
