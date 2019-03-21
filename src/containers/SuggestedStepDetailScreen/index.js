import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { addStep } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';

@translate('suggestedStepDetail')
class SuggestedStepSetailScreen extends Component {
  addStep = () => {
    const { dispatch, step, receiverId, orgId, onComplete } = this.props;

    dispatch(addStep(step, receiverId, orgId ? { id: orgId } : null));
    onComplete();
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

SuggestedStepSetailScreen.propTypes = {
  step: PropTypes.object.isRequired,
  receiverId: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
  orgId: PropTypes.string,
};

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step, receiverId, orgId, onComplete },
      },
    },
  },
) => ({
  step,
  receiverId,
  orgId,
  onComplete,
});
export default connect(mapStateToProps)(SuggestedStepSetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
