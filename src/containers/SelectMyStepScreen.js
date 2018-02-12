import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { navigatePush } from '../actions/navigation';
import { getStepSuggestions } from '../actions/steps';
import SelectStepScreen from './SelectStepScreen';
import { buildTrackingObj, getFirstThreeValidItems } from '../utils/common';
import { ADD_SOMEONE_SCREEN } from './AddSomeoneScreen';

@translate('selectStep')
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
    const { t } = this.props;

    return (
      <SelectStepScreen
        steps={this.props.steps}
        receiverId={this.props.personId}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
        createStepScreenname={buildTrackingObj('onboarding : self : steps : create', 'onboarding', 'self', 'create')}
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
