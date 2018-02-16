import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import SelectStepScreen from './SelectStepScreen';
import { buildTrackingObj, getFourRandomItems } from '../utils/common';

@translate('selectStep')
class SelectMyStepScreen extends Component {
  constructor(props) {
    super(props);
  }

  handleNavigate = () => {
    this.props.onSaveNewSteps();
  };

  render() {
    const { t, enableBackButton, me, steps, personId } = this.props;

    return (
      <SelectStepScreen
        steps={steps}
        receiverId={personId}
        contact={me}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
        createStepTracking={buildTrackingObj('onboarding : self : steps : create', 'onboarding', 'self', 'create')}
        enableBackButton={enableBackButton}
      />
    );
  }

}

const mapStateToProps = ({ steps, auth, myStageReducer }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
  steps: getFourRandomItems(steps.suggestedForMe[myStageReducer.stageId]), //todo handle self stage not set?
  personId: auth.personId,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
