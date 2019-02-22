/* eslint max-lines: 0 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

import { getNextTrackState, trackTabChanges } from '../../middleware/tracking';

export class TrackTabChange extends Component {
  componentDidMount() {
    this.tabFocused({ action: { routeName: this.props.screen } });
  }

  tabFocused = payload => {
    const { dispatch } = this.props;
    const newState = getNextTrackState(payload.action);
    trackTabChanges(payload.action, newState, dispatch);
  };

  render() {
    return <NavigationEvents onDidFocus={this.tabFocused} />;
  }
}

export default connect()(TrackTabChange);
