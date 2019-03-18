import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { addSteps } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';

@translate('suggestedStepDetail')
class SuggestedStepDetailScreen extends Component {
  addStep = async () => {
    const { dispatch, step, receiverId, orgId, next } = this.props;

    await dispatch(addSteps([step], receiverId, { id: orgId }));

    dispatch(next());
  };

  render() {
    const {
      t,
      step: { body, description_markdown },
    } = this.props;

    return (
      <StepDetailScreen
        CenterHeader={null}
        RightHeader={null}
        text={body}
        markdown={description_markdown}
        bottomButtonProps={{
          onPress: this.addStep,
          text: t('addStep'),
        }}
      />
    );
  }
}

SuggestedStepDetailScreen.propTypes = {
  step: PropTypes.object.isRequired,
  receiverId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  orgId: PropTypes.string,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step, receiverId, orgId, next },
      },
    },
  },
) => ({
  step,
  receiverId,
  orgId,
  next,
});
export default connect(mapStateToProps)(SuggestedStepDetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
