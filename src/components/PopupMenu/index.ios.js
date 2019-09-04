import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { ActionSheetIOS } from 'react-native';

import { IconButton } from '../common';
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
    const { containerStyle, iconStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <IconButton
          name="moreIcon"
          type="MissionHub"
          onPress={this.showMenu}
          style={[styles.icon, iconStyle]}
        />
      </View>
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
