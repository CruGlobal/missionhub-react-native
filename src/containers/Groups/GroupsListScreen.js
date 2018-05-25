import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Button } from '../../components/common';
import { navigatePush } from '../../actions/navigation';

import { GROUP_SCREEN } from './GroupScreen';

@connect()
@translate('groupsList')
export default class GroupsListScreen extends Component {
  // TODO: Remove this
  // componentDidMount() {
  //   this.handlePress();
  // }

  handlePress = () => {
    this.props.dispatch(
      navigatePush(GROUP_SCREEN, {
        organization: { id: '728', name: 'DPS Org' },
      }),
    );
  };

  render() {
    return (
      <Button
        text={'Navigate to Group 728'}
        style={{ marginTop: 20 }}
        buttonTextStyle={{ color: 'black' }}
        onPress={this.handlePress}
      />
    );
  }
}
