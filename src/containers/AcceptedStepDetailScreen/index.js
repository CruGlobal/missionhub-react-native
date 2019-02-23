import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Button } from '../../components/common';
import { completeStep } from '../../actions/steps';
import StepDetailScreen from '../StepDetailScreen';

import styles from './styles';

@translate('stepDetail')
class AcceptedStepDetailScreen extends Component {
  completeStep = () => {
    const { dispatch, step } = this.props;

    dispatch(completeStep(step, 'Step Detail'));
  };

  removeStep = () => {};

  render() {
    const { t, step } = this.props;
    const { removeStepButton, removeStepButtonText } = styles;

    return (
      <StepDetailScreen
        centerHeader={null}
        rightHeader={
          <Button
            type="transparent"
            text={t('removeStep').toUpperCase()}
            onPress={this.removeStep}
            style={removeStepButton}
            buttonTextStyle={removeStepButtonText}
          />
        }
        body={null}
        text={step.title}
        bottomButtonProps={{
          onPress: this.completeStep,
          text: t('iDidIt'),
        }}
      />
    );
  }
}

AcceptedStepDetailScreen.propTypes = { step: PropTypes.object.isRequired };

const mapStateToProps = (_, { navigation }) => ({
  step: navigation.state.params.step,
});
export default connect(mapStateToProps)(AcceptedStepDetailScreen);
export const ACCEPTED_STEP_DETAIL_SCREEN = 'nav/ACCEPTED_STEP_DETAIL_SCREEN';
