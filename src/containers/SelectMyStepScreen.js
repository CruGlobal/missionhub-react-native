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
    const { t, enableBackButton, me, suggestedForMe, personId, contactStage } = this.props;

    let steps = [];
    if (contactStage) {
      steps = getFourRandomItems(suggestedForMe[contactStage.id]);
    }

    const section = this.props.onboarding ? 'onboarding' : 'people';

    return (
      <SelectStepScreen
        steps={steps}
        receiverId={personId}
        contact={me}
        useOthersSteps={false}
        onComplete={this.handleNavigate}
        headerText={t('meHeader')}
        createStepTracking={buildTrackingObj(`${section} : self : steps : create`, section, 'self', 'steps')}
        enableBackButton={enableBackButton}
      />
    );
  }

}

const mapStateToProps = ({ steps, auth }, { navigation } ) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
  suggestedForMe: steps.suggestedForMe,
  personId: auth.personId,
});

export default connect(mapStateToProps)(SelectMyStepScreen);
export const SELECT_MY_STEP_SCREEN = 'nav/SELECT_MY_STEP';
export const SELECT_MY_STEP_ONBOARDING_SCREEN = 'nav/SELECT_MY_STEP_ONBOARDING';
