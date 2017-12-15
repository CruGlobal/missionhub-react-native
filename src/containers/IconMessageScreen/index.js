import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { navigatePush } from '../../actions/navigation';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';
import theme from '../../theme';

class IconMessageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
  }

  handleNext() {
    this.props.dispatch(navigatePush(this.props.nextScreen));
  }

  render() {
    const { mainText, buttonText, iconPath } = this.props;

    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <BackButton />

        <Flex align="center" justify="center" value={4}>
          <Image source={iconPath} />
          <Text style={styles.text}>{mainText}</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={this.handleNext}
            text={buttonText}
            style={{ width: theme.fullWidth }}
          />
        </Flex>
      </Flex>
    );
  }
}

IconMessageScreen.propTypes = {
  nextScreen: PropTypes.string.isRequired,
  mainText: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  iconPath: PropTypes.any,
};

export default connect()(IconMessageScreen);
