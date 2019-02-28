import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { Text } from '../../components/common';
import StepDetailScreen from '../../components/StepDetailScreen';

@translate('completedStepDetail')
class CompletedStepDetailScreen extends Component {
  render() {
    const { t, step } = this.props;
    const {
      challenge_suggestion: { description_markdown },
    } = step;

    return (
      <StepDetailScreen
        CenterHeader={<Text>{t('completedStep')}</Text>}
        RightHeader={null}
        markdown={description_markdown}
        text={step.title}
        bottomButtonProps={null}
      />
    );
  }
}

CompletedStepDetailScreen.propTypes = { step: PropTypes.object.isRequired };

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
export default connect(mapStateToProps)(CompletedStepDetailScreen);
export const COMPLETED_STEP_DETAIL_SCREEN = 'nav/COMPLETED_STEP_DETAIL_SCREEN';
