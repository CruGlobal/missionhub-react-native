import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import { STEP_SUGGESTION, ACCEPTED_STEP } from '../../constants';
import Header from '../Header';
import BackButton from '../BackButton';
import { Flex, Button, Text } from '../../components/common';

import styles from './styles';

@translate('stepDetail')
export class StepDetailScreen extends Component {
  render() {
    const { t, step } = this.props;

    const isSuggestion = step.type === STEP_SUGGESTION;
    const isCompleted = !isSuggestion && step.completed_at;

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
          style={styles.header}
        />
        <Flex style={styles.stepTitleContainer}>
          <Text style={styles.stepTitleText}>Share your faith with Sam</Text>
        </Flex>
        <Flex style={styles.tipTitleContainer}>
          <Text style={styles.tipTitleText}>{t('tipTitle')}</Text>
        </Flex>
        <Flex value={1} style={styles.tipDescriptionContainer}>
          <Text style={styles.tipDescriptionText}>
            {
              "Find Common Ground. Ask people their story. What are their challenges?\n\nThat's an easy path to gain someone's trust, understanding their problems, their stories, and it just builds from there."
            }
          </Text>
        </Flex>
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

const mapStateToProps = ({}, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(StepDetailScreen);

export const STEP_DETAIL_SCREEN = 'nav/STEP_DETAIL';
