import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { IconButton } from '../common';
import { showMenu } from '../../utils/common';

import styles from './styles';

// iOS only component
class PopupMenu extends Component {
  open = () => {
    showMenu(this.props.actions);
  };

  render() {
    const { containerStyle, iconStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <IconButton
          name="moreIcon"
          type="MissionHub"
          onPress={this.open}
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
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default PopupMenu;
