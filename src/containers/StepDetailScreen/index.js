import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Markdown from 'react-native-simple-markdown';
import PropTypes from 'prop-types';

import { STEP_SUGGESTION, ACCEPTED_STEP } from '../../constants';
import Header from '../Header';
import BackButton from '../BackButton';
import ReminderButton from '../../components/ReminderButton';
import { Button, Text } from '../../components/common';

import styles, { markdownStyles } from './styles';

@translate('stepDetail')
export class StepDetailScreen extends Component {
  handleAddStep = () => {};

  handleRemoveStep = () => {};

  handleCompleteStep = () => {};

  renderHeader() {
    const { t, isCompleted, isSuggestion } = this.props;
    return (
      <Header
        left={<BackButton iconStyle={styles.backButton} />}
        center={isCompleted && <Text>{t('completedStep')}</Text>}
        right={
          !isSuggestion &&
          !isCompleted && (
            <Button
              type="transparent"
              text={t('removeStep').toUpperCase()}
              onPress={this.handleRemoveStep}
              style={styles.removeStepButton}
              buttonTextStyle={styles.removeStepButtonText}
            />
          )
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
        <View flex={0} align="center" justify="end">
          <Button
            type="secondary"
            onPress={
              isSuggestion ? this.handleAddStep : this.handleCompleteStep
            }
            text={this.props
              .t(isSuggestion ? 'addStep' : 'iDidIt')
              .toUpperCase()}
            style={styles.bottomButton}
          />
        </View>
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
};

const mapStateToProps = (_, { navigation }) => {
  const { step } = navigation.state.params;

  const isSuggestion = step.type === STEP_SUGGESTION;
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
  };
};

export default connect(mapStateToProps)(StepDetailScreen);

export const STEP_DETAIL_SCREEN = 'nav/STEP_DETAIL';
