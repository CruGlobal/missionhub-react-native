import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';
import { Flex } from '../../components/common';
import IconButton from '../../components/IconButton';

import styles from './styles';

export class BackButton extends Component {
  onPress = () => {
    const { dispatch, customNavigate } = this.props;

    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  render() {
    const { absolute, style } = this.props;
    return (
      <Flex
        self="start"
        align="start"
        justify="center"
        style={[style || null, absolute ? styles.absoluteTopLeft : null]}
      >
        <IconButton name="backIcon" type="MissionHub" onPress={this.onPress} />
      </Flex>
    );
  }
}

BackButton.propTypes = {
  customNavigate: PropTypes.func,
  absolute: PropTypes.bool,
};

export default connect()(BackButton);
