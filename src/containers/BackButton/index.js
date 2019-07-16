import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, SafeAreaView, Keyboard } from 'react-native';
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
    const { absolute, style, customIcon, iconStyle } = this.props;
    const Wrapper = absolute ? SafeAreaView : View;
    return (
      <Wrapper
        style={[
          styles.container,
          style,
          absolute ? styles.absoluteTopLeft : null,
        ]}
      >
        <IconButton
          name={customIcon || 'backIcon'}
          type="MissionHub"
          onPress={this.onPress}
          style={iconStyle}
          testID="BackButton"
        />
      </Wrapper>
    );
  }
}

BackButton.propTypes = {
  customNavigate: PropTypes.func,
  absolute: PropTypes.bool,
  customIcon: PropTypes.string,
};

export default connect()(BackButton);
