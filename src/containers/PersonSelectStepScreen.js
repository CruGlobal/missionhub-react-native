import React, {Component} from 'react';
import {connect} from 'react-redux';

import SelectStepScreen from './SelectStepScreen';
import theme from '../theme';
import {getStepSuggestions} from '../actions/steps';
import {getFirstThreeValidItems} from '../utils/common';

class PersonSelectStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  insertName(steps) {
    return steps.map(step => {
      step.body = step.body.replace('<<name>>', this.props.personFirstName);
      return step;
    });
  }

  render() {
    const text = 'What will you do to help ' + this.props.personFirstName + ' experience God?';
    let nextScreen = 'MainTabs';

    // Android doesn't need a primer for notifications the way iOS does
    if (!theme.isAndroid && !this.props.hasAskedPushNotifications) {
      nextScreen = 'NotificationPrimer';
    }

    return (
      <SelectStepScreen
        steps={this.insertName(this.props.steps)}
        receiverId={this.props.personId}
        useOthersSteps={true}
        nextScreen={nextScreen}
        headerText={text} />
    );
  }

}

const mapStateToProps = ({ steps, personProfile }) => ({
  steps: getFirstThreeValidItems(steps.suggestedForOthers),
  personFirstName: personProfile.personFirstName,
  personId: personProfile.id,
});


export default connect(mapStateToProps)(PersonSelectStepScreen);