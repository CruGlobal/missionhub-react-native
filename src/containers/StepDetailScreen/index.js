import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { STEP_SUGGESTION, ACCEPTED_STEP } from '../../constants';
import Header from '../Header';
import BackButton from '../BackButton';
import ReminderButton from '../../components/ReminderButton';
import { Flex, Button, Text } from '../../components/common';
import {
  acceptedStepSelector,
  suggestedStepSelector,
} from '../../selectors/steps';

import styles from './styles';

@translate('stepDetail')
export class StepDetailScreen extends Component {
  render() {
    const { t, step } = this.props;

    const isSuggestion = step.type === STEP_SUGGESTION;
    const isCompleted = !isSuggestion && step.completed_at;

    const stepTitle = step.title || '';
    const tipDescription = (isSuggestion
      ? step
      : step.challenge_suggestion || {}
    ).description_markdown;

    return (
      <Flex value={1} style={styles.container}>
        <Header
          left={<BackButton iconStyle={styles.backButton} />}
          center={isCompleted ? <Text>{t('completedStep')}</Text> : null}
          right={
            !isSuggestion && !isCompleted ? (
              <Button
                type="transparent"
                text={t('removeStep').toUpperCase()}
                onPress={() => {}}
                style={styles.removeStepButton}
                buttonTextStyle={styles.removeStepButtonText}
              />
            ) : null
          }
          shadow={false}
          style={styles.container}
        />
        <Flex style={styles.stepTitleContainer}>
          <Text style={styles.stepTitleText}>{stepTitle}</Text>
        </Flex>
        <ReminderButton />
        {tipDescription ? (
          <Flex value={1} style={styles.tipContainer}>
            <Text style={styles.tipTitleText}>{t('tipTitle')}</Text>
            <ScrollView>
              <Text style={styles.tipDescriptionText}>{tipDescription}</Text>
            </ScrollView>
          </Flex>
        ) : (
          <Flex value={1} />
        )}
        {!isCompleted ? (
          <Flex align="center" justify="end">
            <Button
              type="secondary"
              onPress={() => {}}
              text={t(isSuggestion ? 'addStep' : 'iDidIt').toUpperCase()}
              style={styles.bottomButton}
            />
          </Flex>
        ) : null}
      </Flex>
    );
  }
}

StepDetailScreen.propTypes = {
  step: PropTypes.shape({
    type: PropTypes.oneOf([STEP_SUGGESTION, ACCEPTED_STEP]),
  }).isRequired,
};

const mapStateToProps = ({ steps }, { navigation }) => {
  const { step } = navigation.state.params;

  return {
    step,
  };
};

export default connect(mapStateToProps)(StepDetailScreen);

export const STEP_DETAIL_SCREEN = 'nav/STEP_DETAIL';
