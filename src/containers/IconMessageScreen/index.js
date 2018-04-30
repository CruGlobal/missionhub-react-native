import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text, Button } from '../../components/common';
import theme from '../../theme';

import styles from './styles';

class IconMessageScreen extends Component {
  render() {
    const { mainText, buttonText, iconPath } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <Flex align="start" justify="center" value={4}>
          <Image source={iconPath} style={styles.image} />
          <Text style={styles.text}>{mainText}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.props.onComplete}
            text={buttonText}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
      </Flex>
    );
  }
}

IconMessageScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  mainText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  iconPath: PropTypes.any,
};

export default connect()(IconMessageScreen);
