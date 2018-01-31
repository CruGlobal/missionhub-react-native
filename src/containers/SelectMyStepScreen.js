import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigatePush } from '../actions/navigation';
import { getStepSuggestions } from '../actions/steps';
import SelectStepScreen from './SelectStepScreen';
import { getFirstThreeValidItems } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from './AddSomeoneScreen';

class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  handleNavigate = () => {
    this.props.dispatch(navigatePush(ADD_SOMEONE_SCREEN));
  };

  render() {
    return (
      <SelectStepScreen
        steps={this.props.steps}
        receiverId={this.props.personId}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText="How do you want to move forward on your spiritual journey?"
      />
    );
  }

}

const mapStateToProps = ({ steps, auth }) => ({
  steps: getFirstThreeValidItems(steps.suggestedForMe),
  personId: auth.personId,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';