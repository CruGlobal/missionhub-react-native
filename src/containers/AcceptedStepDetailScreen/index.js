import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Button } from '../../components/common';
import { completeStep, deleteStepWithTracking } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';
import { navigateBack } from '../../actions/navigation';
import ReminderButton from '../../components/ReminderButton';

import styles from './styles';

@translate('acceptedStepDetail')
class AcceptedStepDetailScreen extends Component {
  completeStep = () => {
    const { dispatch, step } = this.props;

    dispatch(completeStep(step, 'Step Detail', true));
  };

  removeStep = () => {
    const { dispatch, step } = this.props;

    dispatch(deleteStepWithTracking(step, 'Step Detail'));
    dispatch(navigateBack());
  };

  render() {
    const { t, step } = this.props;
    const { challenge_suggestion, title, id } = step;
    const { removeStepButton, removeStepButtonText } = styles;

    return (
      <StepDetailScreen
        CenterHeader={null}
        RightHeader={
          <Button
            type="transparent"
            text={t('removeStep').toUpperCase()}
            onPress={this.removeStep}
            style={removeStepButton}
            buttonTextStyle={removeStepButtonText}
          />
        }
        CenterContent={<ReminderButton stepId={id} />}
        markdown={
          challenge_suggestion && challenge_suggestion.description_markdown
        }
        text={title}
        bottomButtonProps={{
          onPress: this.completeStep,
          text: t('iDidIt'),
        }}
      />
    );
  }
}

AcceptedStepDetailScreen.propTypes = { step: PropTypes.object.isRequired };

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step },
      },
    },
  },
) => ({
  step,
});
export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
