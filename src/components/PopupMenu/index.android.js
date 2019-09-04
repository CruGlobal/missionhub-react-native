import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { showMenu } from '../../utils/common';
import { IconButton } from '../common';

import styles from './styles';

// Android only component
class PopupMenu extends Component {
  handlePress = () => {
    showMenu(this.props.actions, this.menu);
  };

  ref = c => (this.menu = c);

  render() {
    const { containerStyle, iconStyle } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <IconButton
          ref={this.ref}
          name="moreIcon"
          type="MissionHub"
          style={[styles.icon, iconStyle]}
          onPress={this.handlePress}
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
    }),
  ).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default PopupMenu;
