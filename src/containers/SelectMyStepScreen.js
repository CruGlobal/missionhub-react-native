import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getStepSuggestions } from '../actions/steps';
import SelectStepScreen from './SelectStepScreen';
import { buildTrackingObj, getFirstThreeValidItems } from '../utils/common';

@translate('selectStep')
class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getStepSuggestions());
  }

  handleNavigate = () => {
    this.props.onSaveNewSteps();
  }

  render() {
    const { t, enableBackButton } = this.props;

    return (
      <SelectStepScreen
        steps={this.props.steps}
        receiverId={this.props.personId}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
        createStepTracking={buildTrackingObj('onboarding : self : steps : create', 'onboarding', 'self', 'create')}
        enableBackButton={enableBackButton}
      />
    );
  }

}

const mapStateToProps = ({ steps, auth }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  steps: getFirstThreeValidItems(steps.suggestedForMe),
  personId: auth.personId,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
