import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ActionSheetIOS } from 'react-native';

import { IconButton, Touchable } from '../common';
import { isFunction } from '../../utils/common';

import styles from './styles';

// iOS only component
@withTranslation()
class PopupMenu extends Component {
  showMenu = () => {
    const { actions, t, title } = this.props;

    const options = actions.map(a => a.text).concat(t('cancel'));
    const select = i =>
      actions[i] && isFunction(actions[i].onPress) && actions[i].onPress();

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
      containerStyle,
      children,
      disabled,
      triggerOnLongPress,
      iconStyle,
    } = this.props;
    return children ? (
      <Touchable
        disabled={disabled}
        {...(triggerOnLongPress
          ? { onLongPress: this.showMenu }
          : { onPress: this.showMenu })}
      >
        {children}
      </Touchable>
    ) : (
      <IconButton
        name="moreIcon"
        type="MissionHub"
        buttonStyle={[styles.container, containerStyle]}
        style={[styles.icon, iconStyle]}
        disabled={disabled}
        onPress={this.showMenu}
      />
    );
  }
}

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
