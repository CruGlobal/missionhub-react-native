import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  Flex,
  Text,
  PlatformKeyboardAvoidingView,
} from '../../components/common';
import CommentBox from '../../components/CommentBox';

import styles from './styles';

@connect()
@translate('groupsCelebrate')
export default class Celebrate extends Component {
  submit = data => {
    LOG('submitting', data);
  };
  render() {
    return (
      <PlatformKeyboardAvoidingView style={styles.celebrate}>
        <ScrollView style={{ flex: 1 }}>
          <Text>Load More</Text>
          <Text>LONG LIST</Text>
        </ScrollView>
        <Flex justify="end">
          <CommentBox onSubmit={this.submit} />
        </Flex>
      </PlatformKeyboardAvoidingView>
    );
  }
}
