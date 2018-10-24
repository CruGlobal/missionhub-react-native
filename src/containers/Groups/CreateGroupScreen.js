import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text } from '../../components/common';
import Header from '../Header';
import BackButton from '../BackButton';

@translate('groupsCreateGroup')
class CreateGroupScreen extends Component {
  render() {
    return (
      <Flex value={1}>
        <Header left={<BackButton />} title="Create Group" />
        <Text>Create Group</Text>
      </Flex>
    );
  }
}

CreateGroupScreen.propTypes = {};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(CreateGroupScreen);
export const CREATE_GROUP_SCREEN = 'nav/CREATE_GROUP_SCREEN';
