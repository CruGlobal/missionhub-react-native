import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Flex, Text } from '../../components/common';

class ChallengeDetailScreen extends Component {
  render() {
    return (
      <Flex value={1} justify="center" align="center">
        <Text>Challenge Detail Screen</Text>
      </Flex>
    );
  }
}

const mapStateToProps = (reduxState, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(ChallengeDetailScreen);
export const CHALLENGE_DETAIL_SCREEN = 'nav/CHALLENGE_DETAIL';
