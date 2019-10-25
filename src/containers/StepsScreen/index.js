/* eslint max-lines: 0 */

import React, { Component } from 'react';
import { View, Image, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

import {
  showNotificationPrompt,
  showWelcomeNotification,
} from '../../actions/notifications';
import {
  getMySteps,
  setStepFocus,
  getMyStepsNextPage,
} from '../../actions/steps';
import { checkForUnreadComments } from '../../actions/unreadComments';
import { navigatePush } from '../../actions/navigation';
import { navToPersonScreen } from '../../actions/person';
import {
  reminderStepsSelector,
  nonReminderStepsSelector,
} from '../../selectors/steps';
import {
  Flex,
  Text,
  Icon,
  IconButton,
  RefreshControl,
  LoadingGuy,
} from '../../components/common';
import StepItem from '../../components/StepItem';
import FooterLoading from '../../components/FooterLoading';
import Header from '../../components/Header';
import NULL from '../../../assets/images/footprints.png';
import {
  openMainMenu,
  refresh,
  toast,
  keyExtractorId,
} from '../../utils/common';
import { trackActionWithoutData } from '../../actions/analytics';
import { navigateToMainTabs } from '../../actions/navigation';
import {
  ACTIONS,
  STEPS_TAB,
  PEOPLE_TAB,
  NOTIFICATION_PROMPT_TYPES,
} from '../../constants';
import BottomButton from '../../components/BottomButton';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../AcceptedStepDetailScreen';
import TrackTabChange from '../TrackTabChange';
import OnboardingCard, {
  GROUP_ONBOARDING_TYPES,
} from '../../containers/Groups/OnboardingCard';

import styles from './styles';

const MAX_REMINDERS = 3;

function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
}

@withTranslation('stepsTab')
export class StepsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      addedReminder: props.reminders && props.reminders.length > 0,
      overscrollUp: false,
      paging: false,
    };

    this.getSteps = this.getSteps.bind(this);
    this.handleSetReminder = this.handleSetReminder.bind(this);
    this.handleRemoveReminder = this.handleRemoveReminder.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleNextPage = debounce(this.handleNextPage.bind(this), 250);
  }

  getSteps() {
    return this.props.dispatch(getMySteps());
  }

  handleRowSelect(step) {
    this.props.dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  }

  hasReminders() {
    return this.props.reminders.length > 0;
  }

  hasMaxReminders() {
    return this.props.reminders.length >= MAX_REMINDERS;
  }

  hasFewSteps() {
    const { steps } = this.props;
    return steps.length <= MAX_REMINDERS;
  }

  canHideStars() {
    return (
      (!this.hasReminders() && this.hasFewSteps()) ||
      (this.hasReminders() && this.hasMaxReminders())
    );
  }

  handleSetReminder(step) {
    const { dispatch, t } = this.props;
    dispatch(trackActionWithoutData(ACTIONS.STEP_PRIORITIZED));

    if (this.hasMaxReminders()) {
      return;
    }

    toast(t('reminderAddedToast'));

    if (!this.hasReminders()) {
      dispatch(showNotificationPrompt(NOTIFICATION_PROMPT_TYPES.FOCUS_STEP));
    }
    dispatch(setStepFocus(step, true));

    dispatch(showWelcomeNotification());
  }

  handleNavToPerson = step => {
    const { receiver, organization } = step;
    this.props.dispatch(navToPersonScreen(receiver, organization));
  };

  handleRemoveReminder(step) {
    const { dispatch } = this.props;
    dispatch(trackActionWithoutData(ACTIONS.STEP_DEPRIORITIZED));
    dispatch(setStepFocus(step, false));
  }

  handleRefresh() {
    this.props.dispatch(checkForUnreadComments());
    refresh(this, this.getSteps);
  }

  handleScroll({ nativeEvent }) {
    const position = nativeEvent.contentOffset.y;
    const overscrollUp = this.state.overscrollUp;
    if (position < 0 && !overscrollUp) {
      this.setState({ overscrollUp: true });
    } else if (position >= 0 && overscrollUp) {
      this.setState({ overscrollUp: false });
    }

    if (isCloseToBottom(nativeEvent)) {
      this.handleNextPage();
    }
  }

  handleBackgroundColor() {
    if (this.state.overscrollUp) {
      return styles.backgroundTop;
    }

    return styles.backgroundBottom;
  }

  handleNextPage() {
    const { hasMoreSteps, dispatch } = this.props;

    if (this.state.paging || !hasMoreSteps) {
      return;
    }

    this.setState({ paging: true });
    dispatch(getMyStepsNextPage())
      .then(() => {
        // Put a slight delay on stopping the paging so that the new items can populate in the list
        setTimeout(() => this.setState({ paging: false }), 500);
      })
      .catch(() => {
        setTimeout(() => this.setState({ paging: false }), 500);
      });
  }

  navToPersonScreen = () => {
    const { dispatch } = this.props;

    dispatch(navigateToMainTabs(PEOPLE_TAB));
  };

  renderFocusPrompt() {
    const { t } = this.props;

    if (this.hasReminders() || this.hasFewSteps()) {
      return null;
    }

    return (
      <Flex
        align="center"
        justify="center"
        style={[styles.top, styles.topEmpty]}
      >
        <Icon name="starGroupIcon" type="MissionHub" size={45} />
        <Text header={true} style={styles.title}>
          {t('reminderTitle').toUpperCase()}
        </Text>
        <Text style={styles.description}>{t('reminderDescription')}</Text>
      </Flex>
    );
  }

  renderReminders() {
    const { reminders } = this.props;
    const focusedSteps = reminders.filter(r => r && r.id);

    if (this.hasReminders()) {
      return (
        <Flex align="center" style={[styles.top]}>
          {focusedSteps.map(s => (
            <StepItem
              step={s}
              key={s.id}
              type="reminder"
              onSelect={this.handleRowSelect}
              onAction={this.handleRemoveReminder}
              onPressName={this.handleNavToPerson}
            />
          ))}
        </Flex>
      );
    }
  }

  listRef = c => (this.list = c);

  renderItem = ({ item }) => {
    return (
      <StepItem
        step={item}
        type="swipeable"
        hideAction={this.canHideStars()}
        onSelect={this.handleRowSelect}
        onAction={this.handleSetReminder}
        onPressName={this.handleNavToPerson}
      />
    );
  };

  renderList() {
    const { steps, t, hasMoreSteps } = this.props;
    if (steps.length === 0) {
      return (
        <Flex value={1} align="center" justify="center">
          <Image source={NULL} />
          <Text header={true} style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>
            {this.hasReminders()
              ? t('nullWithReminders')
              : t('nullNoReminders')}
          </Text>
        </Flex>
      );
    }

    return (
      <FlatList
        ref={this.listRef}
        style={[styles.list, { paddingBottom: hasMoreSteps ? 40 : undefined }]}
        data={steps}
        extraData={{ hideStars: this.canHideStars() }}
        keyExtractor={keyExtractorId}
        renderItem={this.renderItem}
        removeClippedSubviews={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ListFooterComponent={this.state.paging ? <FooterLoading /> : null}
      />
    );
  }

  renderSteps() {
    const { steps, reminders, t } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          style={[this.handleBackgroundColor()]}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.contentContainer,
            {
              // Flex the white background to the bottom when there's only a few steps
              // Don't do it all the time because it causes the top to be static
              flex: steps.length < 5 ? 1 : undefined,
            },
          ]}
        >
          {this.renderReminders()}
          {this.renderList()}
        </ScrollView>
        {steps.length > 0 || reminders.length > 0 ? null : (
          <BottomButton
            testID="TakeAStepWithSomeoneButton"
            text={t('mainTabs:takeAStepWithSomeone')}
            onPress={this.navToPersonScreen}
          />
        )}
      </View>
    );
  }

  openMainMenu = () => this.props.dispatch(openMainMenu());

  render() {
    const { t, steps } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        <TrackTabChange screen={STEPS_TAB} />
        <Header
          left={
            <IconButton
              name="menuIcon"
              type="MissionHub"
              onPress={this.openMainMenu}
            />
          }
          title={t('title').toUpperCase()}
        />
        {steps ? (
          <View style={styles.contentContainer}>
            <OnboardingCard type={GROUP_ONBOARDING_TYPES.steps} />
            {this.renderSteps()}
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <LoadingGuy />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export const mapStateToProps = ({ steps, people, notifications }) => ({
  steps: nonReminderStepsSelector({ steps, people }),
  reminders: reminderStepsSelector({ steps, people }),
  hasMoreSteps: steps.pagination.hasNextPage,
  pushtoken: notifications.token,
});

export default connect(mapStateToProps)(StepsScreen);
