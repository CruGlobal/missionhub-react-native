import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';

import { Touchable, Flex, Icon } from '../../components/common';
import styles from './styles';

class BackButton extends Component {
  render() {
    const { ...rest } = this.props;
    return (
      <Flex self="start" align="start" justify="center" >
        <Touchable
          {...rest}
          onPress={() => {
            if (this.props.customNavigate === 'backToStages') {
              this.props.dispatch(navigateBack());
              this.props.dispatch(navigateBack());
            } else {
              this.props.dispatch(navigateBack());
            }
            Keyboard.dismiss(); // Always dismiss the keyboard when navigating back
          }}
        >
          <Icon name="backIcon" type="MissionHub" style={styles.icon} />
        </Touchable>
      </Flex>
    );
  }
}

const styleTypes = [PropTypes.array, PropTypes.object, PropTypes.number];
BackButton.propTypes = {
  filled: PropTypes.bool,
  customNavigate: PropTypes.string,
  style: PropTypes.oneOfType(styleTypes),
  buttonTextStyle: PropTypes.oneOfType(styleTypes),
};

export default connect()(BackButton);
