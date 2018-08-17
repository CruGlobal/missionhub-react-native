import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findNodeHandle, UIManager } from 'react-native';

import { exists, isFunction } from '../../utils/common';
import { Touchable, Icon } from '../common';

import styles from './styles';

// Android only component
class PopupMenu extends Component {
  handeError = () => {};

  handleItemPress = (e, i) => {
    if (exists(i) && i >= 0) {
      const action = this.props.actions[i] || {};
      if (action.onPress && isFunction(action.onPress)) {
        action.onPress();
      }
    }
  };

  handlePress = () => {
    const actionNames = this.props.actions.map(a => a.text);
    UIManager.showPopupMenu(
      findNodeHandle(this.menu),
      actionNames,
      this.handeError,
      this.handleItemPress,
    );
  };

  ref = c => (this.menu = c);

  render() {
    const { iconProps = {}, style } = this.props;
    return (
      <Touchable
        onPress={this.handlePress}
        borderless={true}
        style={[styles.container, style]}
      >
        <Icon
          ref={this.ref}
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
