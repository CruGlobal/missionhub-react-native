import React, {Component} from 'react';
import theme from '../../theme';
import {connect} from 'react-redux';
import {navigatePush} from '../../actions/navigation';
import {Image} from 'react-native';

import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import BackButton from '../BackButton';

class IconMessageScreen extends Component {
  constructor(props) {
    super(props);

    this.handleNext = this.handleNext.bind(this);
  }

  handleNext(nextScreen) {
    this.props.dispatch(navigatePush(nextScreen));
  }

  render() {
    const { mainText, buttonText, nextScreen, iconPath } = this.props;

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
            onPress={() => this.handleNext(nextScreen)}
            text={buttonText}
            style={{width: theme.fullWidth}}
          />
        </Flex>
      </Flex>
    );
  }
}

export default connect()(IconMessageScreen);