import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/default
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { navigateBack, navigatePush } from '../../actions/navigation';
import { getStepSuggestions, addSteps } from '../../actions/steps';
import { buildCustomStep } from '../../utils/steps';
import StepSuggestionItem from '../../components/StepSuggestionItem';
import { Text, Icon } from '../../components/common';
import BackButton from '../BackButton';
import Header from '../Header';
import BottomButton from '../../components/BottomButton';
import { ADD_STEP_SCREEN } from '../AddStepScreen';
import { disableBack } from '../../utils/common';
import { CREATE_STEP } from '../../constants';
import theme from '../../theme';
import LoadMore from '../../components/LoadMore';

import styles from './styles';

@translate('selectStep')
class SelectStepScreen extends Component {
  state = {
    suggestionIndex: 4,
  };

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

  componentDidMount() {
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

    if (suggestions.length === 0) {
      dispatch(getStepSuggestions(isMe, contactStageId));
    }
  }

  componentWillUnmount() {
    if (!this.props.enableBackButton) {
      disableBack.remove();
    }
  }

  handleLoadSteps = () => {
    const { suggestionIndex } = this.state;

    this.setState({ suggestionIndex: suggestionIndex + 4 });
  };

  getSuggestionSubset() {
    const { suggestionIndex } = this.state;
    const { isMe, suggestions } = this.props;

    const newSuggestions = suggestions.slice(0, suggestionIndex);
    return isMe ? newSuggestions : this.insertName(newSuggestions);
  }

  createCustomStep = text => {
    const { dispatch, myId, receiverId, organization } = this.props;

    dispatch(
      addSteps(
        [buildCustomStep(text, myId === receiverId)],
        receiverId,
        organization,
      ),
    );
  };

  handleCreateStep = () => {
    const { dispatch, createStepTracking } = this.props;

    dispatch(
      navigatePush(ADD_STEP_SCREEN, {
        type: CREATE_STEP,
        trackingObj: createStepTracking,
        onComplete: this.createCustomStep,
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
    const { t, headerText } = this.props;
    return (
      <View flex={1} alignItems={'center'}>
        <Header />
        <Icon name="addStepIcon" type="MissionHub" style={styles.headerIcon} />
        <Text type="header" style={styles.headerTitle}>
          {t('stepsOfFaith')}
        </Text>
        <Text style={styles.headerText}>{headerText}</Text>
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

  renderItem = ({ item }) => {
    const { organization, receiverId } = this.props;

    return (
      <StepSuggestionItem
        step={item}
        receiverId={receiverId}
        orgId={organization && organization.id}
      />
    );
  };

  renderLoadMore = () => (
    <LoadMore
      onPress={this.handleLoadSteps}
      text={this.props.t('loadMoreSteps').toUpperCase()}
    />
  );

  renderCreateStepButton = () => (
    <BottomButton
      onPress={this.handleCreateStep}
      text={this.props.t('createStep')}
    />
  );

  stepsListRef = c => (this.stepsList = c);

  keyExtractor = item => item.id;

  render() {
    const { suggestions } = this.props;
    const { suggestionIndex } = this.state;

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
            data={this.getSuggestionSubset()}
            renderItem={this.renderItem}
            scrollEnabled={true}
            style={styles.list}
            ListFooterComponent={
              suggestions.length > suggestionIndex && this.renderLoadMore
            }
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
