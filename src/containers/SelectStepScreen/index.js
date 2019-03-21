import React, { Component } from 'react';
import { SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import i18next from 'i18next';
import uuidv4 from 'uuid/v4';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import StepsList from '../../components/StepsList';
import { Flex, Text, Button, Icon } from '../../components/common';
import BackButton from '../BackButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack, shuffleArray } from '../../utils/common';
import { CREATE_STEP, CUSTOM_STEP_TYPE } from '../../constants';
import theme from '../../theme';
import Header from '../../components/Header';

import styles from './styles';

@translate('selectStep')
class SelectStepScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: [],
      addedSteps: [],
      suggestions: [],
      contact: null,
      suggestionIndex: 0,
    };
  }

  insertName(steps) {
    return steps.map(step => ({
      ...step,
      body: step.body.replace(
        '<<name>>',
        this.props.contactName
          ? this.props.contactName
          : this.props.personFirstName,
      ),
    }));
  }

  async componentDidMount() {
    const { dispatch, isMe, contactStageId } = this.props;
    let { suggestions } = this.props;
    if (!this.props.enableBackButton) {
      disableBack.add();
    }

    const { response } = await dispatch(
      getStepSuggestions(isMe, contactStageId),
    );
    suggestions = response;
    this.setState({ suggestions: shuffleArray(suggestions) });

    this.handleLoadSteps();
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  handleLoadSteps = () => {
    const { suggestionIndex } = this.state;
    const { suggestions, isMe } = this.props;

    if (suggestionIndex >= (suggestions || []).length) {
      return;
    }

    let suggestionIndexMax = suggestionIndex + 4;
    if (suggestionIndexMax > (suggestions || []).length) {
      suggestionIndexMax = (suggestions || []).length;
    }

    let newSuggestions = suggestions.slice(suggestionIndex, suggestionIndexMax);

    if (!isMe) {
      newSuggestions = this.insertName(newSuggestions);
    }

    this.setState({
      steps: [...this.state.steps, ...newSuggestions],
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
    if (this.props.contact) {
      this.setState({ contact: this.props.contact });
    }
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
    this.props.dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: this.props.createStepTracking,
        onComplete: newStepText => {
          const addedSteps = this.state.addedSteps;

          const newStep = {
            id: uuidv4(),
            body: newStepText,
            selected: true,
            locale: i18next.language,
            challenge_type: CUSTOM_STEP_TYPE,
            self_step: this.props.myId === this.props.receiverId,
          };

          this.setState({
            steps: this.state.steps.concat([newStep]),
            addedSteps: addedSteps.concat([newStep]),
          });
          if (this.stepsList && this.stepsList.onScrollToEnd) {
            this.stepsList.onScrollToEnd();
          }
        },
      }),
    );
  };

  saveAllSteps = async () => {
    const { dispatch, receiverId, organization, onComplete } = this.props;
    const selectedSteps = this.filterSelected();

    await dispatch(addSteps(selectedSteps, receiverId, organization));
    onComplete();
  };

  navigateBackTwoScreens = () => this.props.dispatch(navigateBack(2));

  renderBackButton() {
    const { enableBackButton, contact } = this.props;
    return enableBackButton ? (
      <BackButton
        customNavigate={
          contact || this.state.contact
            ? undefined
            : this.navigateBackTwoScreens
        }
        absolute={true}
      />
    ) : null;
  }

  renderTitle() {
    const { t } = this.props;

    return (
      <Flex value={1} align="center" justify="center">
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text type="header" style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{this.props.headerText}</Text>
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

  renderStickyHeader = () => (
    <Header shadow={false} title={this.props.t('stepsOfFaith').toUpperCase()} />
  );

  stepsListRef = c => (this.stepsList = c);

  render() {
    const { t } = this.props;
    const { primaryColor, parallaxHeaderHeight, headerHeight } = theme;

    return (
      <View style={styles.container}>
        <ParallaxScrollView
          backgroundColor={primaryColor}
          parallaxHeaderHeight={parallaxHeaderHeight}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={headerHeight}
          renderStickyHeader={this.renderStickyHeader}
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
        <SafeAreaView>{this.renderSaveButton()}</SafeAreaView>
        {this.renderBackButton()}
      </View>
    );
  }
}

SelectStepScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
  createStepTracking: PropTypes.object.isRequired,
  personFirstName: PropTypes.string,
  contact: PropTypes.object,
  receiverId: PropTypes.string,
  enableBackButton: PropTypes.bool,
  organization: PropTypes.object,
  contactStageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  isMe: PropTypes.bool.isRequired,
};

export const mapStateToProps = ({ auth, steps }, { isMe, contactStageId }) => ({
  myId: auth.person.id,
  suggestions: isMe
    ? steps.suggestedForMe[contactStageId]
    : steps.suggestedForOthers[contactStageId],
});

export default connect(mapStateToProps)(SelectStepScreen);
