import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';

import BACK_ICON from '../../../assets/images/back_arrow.png';
import { Touchable, Flex } from '../../components/common';
import styles from './styles';

class BackButton extends Component {
  render() {
    const { ...rest } = this.props;
    return (
      <Flex self="start" align="start" justify="center" >
        <Touchable
          {...rest}
          onPress={() => {
            this.props.dispatch(navigateBack());
            Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
          }}
        >
          <Image source={BACK_ICON} style={styles.icon} />
        </Touchable>
      </Flex>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
BackButton.propTypes = {
  filled: PropTypes.bool,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
};

export default connect()(BackButton);
