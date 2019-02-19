import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Markdown from 'react-native-simple-markdown';
import PropTypes from 'prop-types';

import { STEP_SUGGESTION, ACCEPTED_STEP } from '../../constants';
import Header from '../Header';
import BackButton from '../BackButton';
import BottomButton from '../../components/BottomButton';
import ReminderButton from '../../components/ReminderButton';
import { Button, Text } from '../../components/common';
import { addSteps } from '../../actions/steps';
import { navigateBack } from '../../actions/navigation';

import styles, { markdownStyles } from './styles';

@translate('stepDetail')
export class StepDetailScreen extends Component {
  handleAddStep = async () => {
    const { dispatch, step, receiverId, orgId } = this.props;

    await dispatch(addSteps([step], receiverId, { id: orgId }));

    dispatch(navigateBack());
  };

  handleRemoveStep = () => {};

  handleCompleteStep = () => {};

  renderHeader() {
    const { t, isCompleted, isSuggestion } = this.props;
    return (
      <Header
        left={<BackButton iconStyle={styles.backButton} />}
        center={(isCompleted && <Text>{t('completedStep')}</Text>) || null}
        right={
          (!isSuggestion &&
            !isCompleted && (
              <Button
                type="transparent"
                text={t('removeStep').toUpperCase()}
                onPress={this.handleRemoveStep}
                style={styles.removeStepButton}
                buttonTextStyle={styles.removeStepButtonText}
              />
            )) ||
          null
        }
        shadow={false}
        style={styles.container}
      />
    );
  }

  renderTipSection() {
    const { tipDescription } = this.props;
    return (
      <View flex={1}>
        {tipDescription && (
          <ScrollView style={styles.tipContainer}>
            <Markdown styles={markdownStyles}>{tipDescription}</Markdown>
          </ScrollView>
        )}
      </View>
    );
  }

  renderBottomButton = () => {
    const { isCompleted, isSuggestion } = this.props;
    return (
      !isCompleted && (
        <BottomButton
          onPress={isSuggestion ? this.handleAddStep : this.handleCompleteStep}
          text={this.props.t(isSuggestion ? 'addStep' : 'iDidIt')}
        />
      )
    );
  };

  render() {
    const { stepTitle } = this.props;
    return (
      <View flex={1} style={styles.container}>
        {this.renderHeader()}
        <Text style={styles.stepTitleText}>{stepTitle}</Text>
        <ReminderButton />
        {this.renderTipSection()}
        {this.renderBottomButton()}
      </View>
    );
  }
}

StepDetailScreen.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.oneOf([STEP_SUGGESTION, ACCEPTED_STEP]),
  }).isRequired,
  receiverId: PropTypes.string.isRequired,
  orgId: PropTypes.string,
};

const mapStateToProps = (_, { navigation }) => {
  const { step, receiverId, orgId } = navigation.state.params;

  const isSuggestion = step._type === STEP_SUGGESTION;
  const isCompleted = !isSuggestion && step.completed_at;

  const stepTitle = isSuggestion ? step.body : step.title;
  const tipDescription = (isSuggestion ? step : step.challenge_suggestion || {})
    .description_markdown;

  return {
    step,
    isSuggestion,
    isCompleted,
    stepTitle,
    tipDescription,
    receiverId,
    orgId,
  };
};

export default connect(mapStateToProps)(StepDetailScreen);

export const STEP_DETAIL_SCREEN = 'nav/STEP_DETAIL';
