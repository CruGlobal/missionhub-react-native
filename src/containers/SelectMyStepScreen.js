import React, {Component} from 'react';
import {connect} from 'react-redux';

import { getStepSuggestions } from '../actions/steps';
import SelectStepScreen from './SelectStepScreen';
import {getFirstThreeValidItems} from '../utils/common';

class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  render() {
    return (
      <SelectStepScreen
        steps={this.props.steps}
        useOthersSteps={false}
        nextScreen="AddSomeone"
        headerText="How do you want to move forward on your spiritual journey?"
      />
    );
  }

}

const mapStateToProps = ({ steps }) => ({
  steps: getFirstThreeValidItems(steps.suggestedForMe),
});

export default connect(mapStateToProps)(SelectMyStepScreen);