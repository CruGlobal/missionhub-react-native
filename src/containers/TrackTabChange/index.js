/* eslint max-lines: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

import { TRACK_TAB } from '../../constants';

export class TrackTabChange extends Component {
  componentDidMount() {
    this.tabFocused({ action: { routeName: this.props.screen } });
  }

  tabFocused = payload => {
    const { dispatch } = this.props;
    dispatch({ type: TRACK_TAB, routeName: payload.action.routeName });
  };

  render() {
    return <NavigationEvents onDidFocus={this.tabFocused} />;
  }
}

export default connect()(TrackTabChange);
