import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { addStep } from '../../actions/steps';
import StepDetailScreen from '../../components/StepDetailScreen';

import styles from './styles';

@withTranslation('suggestedStepDetail')
class SuggestedStepDetailScreen extends Component {
  addStep = () => {
    const { dispatch, step, personId, orgId, next } = this.props;

    dispatch(addStep(step, personId, orgId));

    dispatch(next({ contactId: personId, orgId }));
  };
  render() {
    const {
      t,
      step: { body, description_markdown },
    } = this.props;
    const { centerContent } = styles;

    return (
      <StepDetailScreen
        CenterHeader={null}
        RightHeader={null}
        CenterContent={<View style={centerContent} />}
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
  personId: PropTypes.string.isRequired,
  orgId: PropTypes.string,
  next: PropTypes.func.isRequired,
};

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step, personId, orgId },
      },
    },
    next,
  },
) => ({
  step,
  personId,
  orgId,
  next,
});
export default connect(mapStateToProps)(SuggestedStepDetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
