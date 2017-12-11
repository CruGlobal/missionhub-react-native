import React, {Component} from 'react';
import {connect} from 'react-redux';

import SelectStepScreen from './SelectStepScreen';

class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SelectStepScreen
        useOthersSteps={false}
        nextScreen="AddSomeone"
        headerText="How do you want to move forward on your spiritual journey?" />
    );
  }

}

export default connect()(SelectMyStepScreen);