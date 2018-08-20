import React, { Component } from 'react';
import { ActionSheetIOS } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Touchable, Icon } from '../common';
import { isFunction } from '../../utils/common';

import styles from './styles';

// iOS only component
@translate()
class PopupMenu extends Component {
  open = () => {
    const { t, actions } = this.props;
    const options = actions.map(o => o.text).concat(t('cancel'));

    ActionSheetIOS.showActionSheetWithOptions(
      { options, cancelButtonIndex: options.length - 1 },
      buttonIndex => {
        if (actions[buttonIndex] && isFunction(actions[buttonIndex].onPress)) {
          actions[buttonIndex].onPress();
        }
      },
    );
  };

  render() {
    const { iconProps = {}, style } = this.props;
    return (
      <Touchable onPress={this.open} style={[styles.container, style]}>
        <Icon
          name="moreIcon"
          type="MissionHub"
          {...iconProps}
          style={[styles.icon, iconProps.style]}
        />
      </Touchable>
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
  iconProps: PropTypes.object,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default PopupMenu;
