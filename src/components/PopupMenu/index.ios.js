import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Touchable, Icon } from '../common';
import { showMenu } from '../../utils/common';

import styles from './styles';

// iOS only component
class PopupMenu extends Component {
  open = () => {
    showMenu(this.props.actions);
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
      destructive: PropTypes.bool,
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
