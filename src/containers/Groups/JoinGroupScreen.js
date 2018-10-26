import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text } from '../../components/common';
import Header from '../Header';
import BackButton from '../BackButton';

@translate('groupsJoinGroup')
class JoinGroupScreen extends Component {
  render() {
    return (
      <Flex value={1}>
        <Header left={<BackButton />} title="Join Group" />
        <Text>Join Group</Text>
      </Flex>
    );
  }
}

JoinGroupScreen.propTypes = {};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(JoinGroupScreen);
export const JOIN_GROUP_SCREEN = 'nav/JOIN_GROUP_SCREEN';
