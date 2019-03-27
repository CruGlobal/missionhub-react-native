import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { showMenu } from '../../utils/common';
import { Touchable, Icon } from '../common';

import styles from './styles';

// Android only component
class PopupMenu extends Component {
  handlePress = () => {
    showMenu(this.props.actions, this.menu);
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
