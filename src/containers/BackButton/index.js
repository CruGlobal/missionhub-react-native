import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';

import { Flex } from '../../components/common';
import styles from './styles';
import IconButton from '../../components/IconButton';

export class BackButton extends Component {
  render() {
    const { dispatch, customNavigate, absolute, style } = this.props;
    return (
      <Flex self="start" align="start" justify="center" style={[ style || null, absolute ? styles.absoluteTopLeft : null ]}>
        <IconButton
          name="backIcon"
          type="MissionHub"
          onPress={() => {
            customNavigate ? customNavigate() : dispatch(navigateBack());
            Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
          }}
        />
      </Flex>
    );
  }
}

BackButton.propTypes = {
  customNavigate: PropTypes.func,
  absolute: PropTypes.bool,
};

export default connect()(BackButton);
