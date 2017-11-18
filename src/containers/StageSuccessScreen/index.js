import React, {Component} from 'react';
import {connect} from 'react-redux';
import theme from '../../theme';

import styles from './styles';
import { Flex, Text, Button, BackButton } from '../../components/common';

class StageSuccessScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <BackButton />
        <Flex align="center" justify="center" value={4}>

          <Text style={styles.text}>{this.props.firstName}, {'\n'}We'd
            like to offer some things to help you in your spiritual journey.</Text>
        </Flex>
        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => console.log('go to next screen')}
            text="OK"
            style={{width: theme.fullWidth}}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}) => ({
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(StageSuccessScreen);
