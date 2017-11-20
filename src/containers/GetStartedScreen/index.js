import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../../actions/navigation';

import styles from './styles';
import { Flex, Text, Button, BackButton } from '../../components/common';
import theme from '../../theme';

class GetStartedScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <BackButton />

        <Flex align="center" justify="center" value={4} >
          <Text type="header" style={styles.headerTitle}>hi {this.props.firstName.toLowerCase()}!</Text>
          <Text style={styles.text}>While everyone's spiritual journey is unique, many people progress through a five stage journey toward God.{'\n\n'}Let's figure out where you are on your journey.</Text>
        </Flex>

        <Flex value={1} align="stretch" justify="end">
          <Button
            type="secondary"
            onPress={() => this.props.dispatch(navigatePush('Stage'))}
            text="LET'S GET STARTED"
            style={{width: theme.fullWidth}}
          />
        </Flex>
      </Flex>
    );
  }
}

const mapStateToProps = ({profile}, { navigation }) => ({
  id: navigation.state.params ? navigation.state.params.id : '',
  firstName: profile.firstName,
});

export default connect(mapStateToProps)(GetStartedScreen);
