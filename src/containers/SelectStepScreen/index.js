import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import i18next from 'i18next';
import uuidv4 from 'uuid/v4';

import { navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';
import { Flex, Text, Button, Icon } from '../../components/common';
import BackButton from '../BackButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { buildTrackingObj, shuffleArray } from '../../utils/common';
import { CREATE_STEP, CUSTOM_STEP_TYPE } from '../../constants';
import theme from '../../theme';
import { isMeSelector, personSelector } from '../../selectors/people';

import styles from './styles';

@translate('selectStep')
class SelectStepScreen extends Component {
  state = {
    steps: [],
    addedSteps: [],
    suggestions: [],
    person: null,
    suggestionIndex: 0,
  };

  insertName(steps) {
    const { person } = this.props;

    return steps.map(step => ({
      ...step,
      body: step.body.replace('<<name>>', person.first_name),
    }));
  }

  async componentDidMount() {
    const { dispatch, isMe, stageId, suggestions } = this.props;

    let newSuggestions;

    if (!suggestions) {
      const { response } = await dispatch(getStepSuggestions(isMe, stageId));
      newSuggestions = response;
    }
    this.setState({ suggestions: shuffleArray(newSuggestions || suggestions) });

    this.handleLoadSteps();
  }

  handleLoadSteps = () => {
    const { suggestionIndex, steps } = this.state;
    const { suggestions, isMe } = this.props;

    if (suggestionIndex >= suggestions.length) {
      return;
    }

    let suggestionIndexMax = suggestionIndex + 4;
    if (suggestionIndexMax > suggestions.length) {
      suggestionIndexMax = suggestions.length;
    }

    let newSuggestions = suggestions.slice(suggestionIndex, suggestionIndexMax);

    if (!isMe) {
      newSuggestions = this.insertName(newSuggestions);
    }

    this.setState({
      steps: [...steps, ...newSuggestions],
      suggestionIndex: suggestionIndexMax,
    });
  };

  filterSelected() {
    return this.state.steps.filter(s => s.selected);
  }

  handleSelectStep = item => {
    const steps = this.state.steps.map(
      s => (s && s.id === item.id ? { ...s, selected: !s.selected } : s),
    );
    this.setState({ steps });
  };

  handleCreateStep = () => {
    const { dispatch, isMe, trackAsOnboarding } = this.props;
    const { steps, addedSteps } = this.state;

    const section = trackAsOnboarding ? 'onboarding' : 'people';
    const subsection = isMe ? 'self' : 'person';

    dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: buildTrackingObj([section, subsection, 'steps'], 'create'),
        onComplete: newStepText => {
          const newStep = {
            id: uuidv4(),
            body: newStepText,
            selected: true,
            locale: i18next.language,
            challenge_type: CUSTOM_STEP_TYPE,
            self_step: isMe,
          };

          this.setState({
            steps: [...steps, newStep],
            addedSteps: [...addedSteps, newStep],
          });
          if (this.stepsList && this.stepsList.onScrollToEnd) {
            this.stepsList.onScrollToEnd();
          }
        },
      }),
    );
  };

  saveAllSteps = async () => {
    const { dispatch, next, person, isMe, orgId } = this.props;
    const selectedSteps = this.filterSelected();

    await dispatch(addSteps(selectedSteps, person.id, orgId));
    dispatch(next({ personId: person.id, isMe, orgId }));
  };

  renderTitle() {
    const { t, person, isMe } = this.props;

    return (
      <Flex
        value={1}
        align="center"
        justify="center"
        style={{ marginTop: theme.notchHeight }}
      >
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text type="header" style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>
          {isMe
            ? t('meHeader')
            : t('personHeader', { name: person.first_name })}
        </Text>
      </Flex>
    );
  }

  renderSaveButton() {
    const { t } = this.props;
    return this.filterSelected().length > 0 ? (
      <Flex align="center" justify="end">
        <Button
          type="secondary"
          onPress={this.saveAllSteps}
          text={t('addStep').toUpperCase()}
          style={styles.addButton}
        />
      </Flex>
    ) : null;
  }

  renderForeground = () => (
    <Flex value={1} align="center" justify="center">
      {this.renderTitle()}
    </Flex>
  );

  renderStickHeader = () => (
    <Flex align="center" justify="center" style={styles.collapsedHeader}>
      <Text style={styles.collapsedHeaderTitle}>
        {this.props.t('stepsOfFaith').toUpperCase()}
      </Text>
    </Flex>
  );

  stepsListRef = c => (this.stepsList = c);

  render() {
    const { t } = this.props;

    return (
      <Flex style={styles.container}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          parallaxHeaderHeight={215 + theme.notchHeight}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={theme.headerHeight}
          renderStickyHeader={this.renderStickHeader}
        >
          <StepsList
            ref={this.stepsListRef}
            items={this.state.steps}
            createStepText={t('createStep')}
            loadMoreStepsText={t('loadMoreSteps')}
            onSelectStep={this.handleSelectStep}
            onCreateStep={this.handleCreateStep}
            onLoadMoreSteps={this.handleLoadSteps}
          />
        </ParallaxScrollView>
        {this.renderSaveButton()}
        <BackButton absolute={true} />
      </Flex>
    );
  }
}

SelectStepScreen.propTypes = {
  person: PropTypes.object.isRequired,
  isMe: PropTypes.bool.isRequired,
  orgId: PropTypes.string,
  stageId: PropTypes.string.isRequired,
  suggestions: PropTypes.array, // This component loads this into redux so it may not be available at first
};

export const mapStateToProps = ({ auth, people, steps }, { navigation }) => {
  const { personId, orgId, stageId } = navigation.state.params || {};

  const person = personSelector({ people }, { personId, orgId });
  const isMe = isMeSelector({ auth }, { personId });

  return {
    person,
    isMe,
    orgId,
    stageId,
    suggestions: isMe
      ? steps.suggestedForMe[stageId]
      : steps.suggestedForOthers[stageId],
  };
};

export default connect(mapStateToProps)(SelectStepScreen);
export const SELECT_STEP_SCREEN = 'nav/SELECT_STEP_SCREEN';
