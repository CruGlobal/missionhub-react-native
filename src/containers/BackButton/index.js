import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';
import IconButton from '../../components/IconButton';

import styles from './styles';

export class BackButton extends Component {
  onPress = () => {
    const { dispatch, customNavigate } = this.props;

    customNavigate ? customNavigate() : dispatch(navigateBack());
    Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
  };

  render() {
    const { style, customIcon, iconStyle } = this.props;
    return (
      <View style={[styles.container, style]}>
        <IconButton
          name={customIcon || 'backIcon'}
          type="MissionHub"
          onPress={this.onPress}
          style={iconStyle}
          testID="BackButton"
        />
      </View>
    );
  }
}

BackButton.propTypes = {
  customNavigate: PropTypes.func,
  absolute: PropTypes.bool,
  customIcon: PropTypes.string,
};

export default connect()(BackButton);
