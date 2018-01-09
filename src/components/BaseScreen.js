import { Component } from 'react';
import { trackState } from '../actions/analytics';

class BaseScreen extends Component {
  componentDidMount() {
    this.props.dispatch(trackState(this.constructor.name));
  }
}

export default BaseScreen;