import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { navigateBack } from '../../actions/navigation';

import { Touchable, Flex, Icon } from '../../components/common';
import styles from './styles';

class BackButton extends Component {
  render() {
    const { dispatch, customNavigate, ...rest } = this.props;
    return (
      <Flex self="start" align="start" justify="center" style={styles.absoluteTopLeft}>
        <Touchable
          {...rest}
          isAndroidOpacity={true}
          onPress={() => {
            if (customNavigate === 'backToStages') {
              dispatch(navigateBack(2));
            } else {
              dispatch(navigateBack());
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

BackButton.propTypes = {
  customNavigate: PropTypes.string,
};

export default connect()(BackButton);
