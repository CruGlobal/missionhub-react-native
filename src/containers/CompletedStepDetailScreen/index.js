import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';
import StepDetailScreen from '../StepDetailScreen';

@translate('stepDetail')
class CompletedStepDetailScreen extends Component {
  render() {
    const { t, step } = this.props;

    return (
      <StepDetailScreen
        centerHeader={<Text>{t('completedStep')}</Text>}
        rightHeader={null}
        body={null}
        text={step.title}
        bottomButtonProps={null}
      />
    );
  }
}

CompletedStepDetailScreen.propTypes = { step: PropTypes.object.isRequired };

const mapStateToProps = (_, { navigation }) => ({
  step: navigation.state.params.step,
});
export default connect(mapStateToProps)(CompletedStepDetailScreen);
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
