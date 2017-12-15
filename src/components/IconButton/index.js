import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '../common';
import styles from './styles';
// import theme from '../../theme';


export default class IconButton extends Component {
  render() {
    const { name, type, style = {}, ...rest } = this.props;

    return (
      <Button
        type="transparent"
        {...rest}
      >
        <Icon name={name} type={type} style={[styles.iconWrap, style]} {...rest} />
      </Button>
    );
  }
}

IconButton.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
};
