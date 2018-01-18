import { Component } from 'react';
import { trackState } from '../actions/analytics';

//NOTE: only classes with connect() should extend this
class BaseScreen extends Component {
  componentDidMount() {
    this.props.dispatch(trackState(this.constructor.name));
  }
}

export default BaseScreen;