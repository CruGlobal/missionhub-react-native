import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { getStepSuggestions } from '../../actions/steps';
import StepSuggestionItem from '../../components/StepSuggestionItem';
import { Text, Icon, Button } from '../../components/common';
import BackButton from '../BackButton';
import Header from '../Header';
import BottomButton from '../../components/BottomButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack, shuffleArray } from '../../utils/common';
import { CREATE_STEP } from '../../constants';
import theme from '../../theme';

import styles from './styles';

@translate('selectStep')
class SelectStepScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      suggestionIndex: 4,
    };
  }

  insertName(steps) {
    const { contactName, personFirstName } = this.props;
    return steps.map(step => ({
      ...step,
      body: step.body.replace(
        '<<name>>',
        contactName ? contactName : personFirstName,
      ),
    }));
  }

  async componentDidMount() {
    const {
      dispatch,
      enableBackButton,
      suggestions = [],
      isMe,
      contactStageId,
    } = this.props;
    if (!enableBackButton) {
      disableBack.add();
    }

    let suggestionList;
    if (suggestions.length > 0) {
      suggestionList = suggestions;
    } else {
      const { response } = await dispatch(
        getStepSuggestions(isMe, contactStageId),
      );
      suggestionList = response;
    }

    this.setState({ suggestions: shuffleArray(suggestionList) });
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  handleLoadSteps = () => {
    const { suggestionIndex, suggestions = [] } = this.state;

    let newSuggestionIndex = suggestionIndex + 4;
    if (newSuggestionIndex > suggestions.length) {
      newSuggestionIndex = suggestions.length;
    }

    this.setState({ suggestionIndex: newSuggestionIndex });
  };

  getSuggestionSubset() {
    const { suggestionIndex, suggestions = [] } = this.state;
    const { isMe } = this.props;

    let newSuggestions = suggestions.slice(0, suggestionIndex);

    if (!isMe) {
      newSuggestions = this.insertName(newSuggestions);
    }

    return newSuggestions;
  }

  handleCreateStep = () => {
    const { dispatch, createStepTracking } = this.props;

    dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: createStepTracking,
      }),
    );
  };

  navigateBackTwoScreens = () => this.props.dispatch(navigateBack(2));

  renderBackButton() {
    const { enableBackButton, contact } = this.props;
    return enableBackButton ? (
      <BackButton
        customNavigate={contact ? undefined : this.navigateBackTwoScreens}
        absolute={true}
      />
    ) : null;
  }

  renderForeground = () => {
    const { t } = this.props;
    return (
      <View flex={1} alignItems={'center'}>
        <Header />
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text type="header" style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{this.props.headerText}</Text>
      </View>
    );
  };

  renderStickHeader = () => (
    <Header
      center={
        <Text style={styles.collapsedHeaderTitle}>
          {this.props.t('stepsOfFaith').toUpperCase()}
        </Text>
      }
    />
  );

  renderItem = ({ item }) => <StepSuggestionItem step={item} />;

  renderLoadMore = () => {
    const { loadMoreStepsButton, loadMoreStepsButtonText } = styles;

    return (
      <Button
        pill={true}
        text={this.props.t('loadMoreSteps').toUpperCase()}
        onPress={this.handleLoadSteps}
        style={loadMoreStepsButton}
        buttonTextStyle={loadMoreStepsButtonText}
      />
    );
  };

  renderCreateStepButton = () => (
    <BottomButton
      onPress={this.handleCreateStep}
      text={this.props.t('createStep').toUpperCase()}
    />
  );

  stepsListRef = c => (this.stepsList = c);

  keyExtractor = item => item.id;

  render() {
    const suggestions = this.getSuggestionSubset();

    return (
      <View flex={1}>
        <ParallaxScrollView
          backgroundColor={theme.primaryColor}
          contentBackgroundColor={theme.extraLightGrey}
          parallaxHeaderHeight={240 + theme.notchHeight}
          renderForeground={this.renderForeground}
          stickyHeaderHeight={theme.headerHeight}
          renderStickyHeader={this.renderStickHeader}
        >
          <FlatList
            ref={this.stepsListRef}
            keyExtractor={this.keyExtractor}
            data={suggestions}
            renderItem={this.renderItem}
            scrollEnabled={true}
            style={styles.list}
            ListFooterComponent={this.renderLoadMore}
          />
        </ParallaxScrollView>
        {this.renderCreateStepButton()}
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
