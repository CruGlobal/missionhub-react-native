import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Markdown from 'react-native-simple-markdown';
import PropTypes from 'prop-types';

import { addSteps } from '../../actions/steps';
import { navigateBack } from '../../actions/navigation';
import StepDetailScreen from '../StepDetailScreen';

import styles, { markdownStyles } from './styles';

@translate('stepDetail')
class SuggestedStepSetailScreen extends Component {
  addStep = async () => {
    const { dispatch, step, receiverId, orgId } = this.props;

    await dispatch(addSteps([step], receiverId, { id: orgId }));

    dispatch(navigateBack());
  };

  render() {
    const {
      t,
      step: { body, tipDescription },
    } = this.props;
    const { tipContainer } = styles;

    return (
      <StepDetailScreen
        centerHeader={null}
        rightHeader={null}
        body={
          <ScrollView style={tipContainer}>
            <Markdown styles={markdownStyles}>{tipDescription}</Markdown>
          </ScrollView>
        }
        text={body}
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
  orgId: PropTypes.string.isRequired,
};

const mapStateToProps = (
  _,
  {
    navigation: {
      state: {
        params: { step, receiverId, orgId },
      },
    },
  },
) => ({
  step,
  receiverId,
  orgId,
});
export default connect(mapStateToProps)(SuggestedStepSetailScreen);
export const SUGGESTED_STEP_DETAIL_SCREEN = 'nav/SUGGESTED_STEP_DETAIL_SCREEN';
