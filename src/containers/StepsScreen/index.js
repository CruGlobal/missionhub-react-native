import React, { Component } from 'react';
import { View, Image, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import debounce from 'lodash/debounce';

import { removeSwipeStepsHome, removeSwipeStepsReminder } from '../../actions/swipe';
import { loadHome } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';
import { showReminderScreen, showWelcomeNotification, toast } from '../../actions/notifications';
import {
  getMySteps, setStepFocus, completeStepReminder, getMyStepsNextPage,
  deleteStepWithTracking,
} from '../../actions/steps';
import { reminderStepsSelector, nonReminderStepsSelector } from '../../selectors/steps';

import styles from './styles';
import { Flex, Text, Icon, IconButton, RefreshControl, LoadingGuy } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import FooterLoading from '../../components/FooterLoading';
import Header from '../Header';
import NULL from '../../../assets/images/footprints.png';
import { openMainMenu, refresh } from '../../utils/common';
import { CONTACT_SCREEN } from '../ContactScreen';
import { trackAction } from '../../actions/analytics';
import { ACTIONS } from '../../constants';

const MAX_REMINDERS = 3;

function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
}

@translate('stepsTab')
export class StepsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      addedReminder: props.reminders.length > 0,
      overscrollUp: false,
      paging: false,
    };

    this.getSteps = this.getSteps.bind(this);
    this.completeStepBump = this.completeStepBump.bind(this);
    this.completeReminderBump = this.completeReminderBump.bind(this);
    this.handleSetReminder = this.handleSetReminder.bind(this);
    this.handleRemoveReminder = this.handleRemoveReminder.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleNextPage = debounce(this.handleNextPage.bind(this), 250);
  }

  componentWillMount() {
    this.getSteps().then(() => {
      this.props.dispatch(loadHome());
    });
  }

  async getSteps() {
    await this.props.dispatch(getMySteps());
  }

  completeStepBump() {
    this.props.dispatch(removeSwipeStepsHome());
  }

  completeReminderBump() {
    this.props.dispatch(removeSwipeStepsReminder());
  }

  handleRowSelect(step) {
    this.props.dispatch(navigatePush(CONTACT_SCREEN, { person: step.receiver, organization: step.organization }));
  }

  hasReminders() {
    return this.props.reminders.length > 0;
  }

  hasMaxReminders() {
    return this.props.reminders.length >= MAX_REMINDERS;
  }

  handleSetReminder(step) {
    const { dispatch, t } = this.props;
    dispatch(trackAction(ACTIONS.STEP_PRIORITIZED));

    if (this.hasMaxReminders()) {
      return;
    }

    dispatch(toast(t('reminderAddedToast')));

    dispatch(setStepFocus(step, true));
    if (!this.hasReminders()) {
      dispatch(showReminderScreen());
    }
    dispatch(showWelcomeNotification());
  }

  handleRemoveReminder(step) {
    const { dispatch } = this.props;
    dispatch(trackAction(ACTIONS.STEP_DEPRIORITIZED));
    dispatch(setStepFocus(step, false));
  }

  handleCompleteReminder(step) {
    this.props.dispatch(completeStepReminder(step));
  }

  handleDeleteReminder(step) {
    this.props.dispatch(deleteStepWithTracking(step));
  }

  handleRefresh() {
    refresh(this, this.getSteps);
  }

  handleScroll({ nativeEvent }) {
    const position = nativeEvent.contentOffset.y;
    const overscrollUp = this.state.overscrollUp;
    if (position < 0 && !overscrollUp) this.setState({ overscrollUp: true });
    else if (position >= 0 && overscrollUp) this.setState({ overscrollUp: false });

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
    dispatch(getMyStepsNextPage()).then(() => {
      // Put a slight delay on stopping the paging so that the new items can populate in the list
      setTimeout(() => this.setState({ paging: false }), 500);
    }).catch(() => {
      setTimeout(() => this.setState({ paging: false }), 500);
    });
  }

  renderFocusPrompt() {
    const { t } = this.props;

    if (this.hasReminders()) {
      return null;
    }

    return (
      <Flex align="center" justify="center" style={[ styles.top, styles.topEmpty ]}>
        <Icon name="starGroupIcon" type="MissionHub" size={45} />
        <Text type="header" style={styles.title}>
          {t('reminderTitle').toUpperCase()}
        </Text>
        <Text style={styles.description}>
          {t('reminderDescription')}
        </Text>
      </Flex>
    );
  }

  renderReminders() {
    const { reminders, showStepReminderBump } = this.props;

    if (this.hasReminders()) {
      return (
        <Flex align="center" style={[ styles.top ]}>
          {
            reminders.map((s, index) => (
              <RowSwipeable
                key={s.id}
                bump={showStepReminderBump && index === 0}
                onBumpComplete={showStepReminderBump && index === 0 ? this.completeReminderBump : undefined}
                onDelete={() => this.handleDeleteReminder(s)}
                onComplete={() => this.handleCompleteReminder(s)}
              >
                <StepItem
                  step={s}
                  type="reminder"
                  onSelect={this.handleRowSelect}
                  onAction={this.handleRemoveReminder} />
              </RowSwipeable>
            ))
          }
        </Flex>
      );
    }
  }

  renderList() {
    const { steps, t, showStepBump, hasMoreSteps } = this.props;
    if (steps.length === 0) {
      return (
        <Flex value={1} align="center" justify="center">
          <Image source={NULL} />
          <Text type="header" style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>
            {
              this.hasReminders() ? t('nullWithReminders') : t('nullNoReminders')
            }
          </Text>
        </Flex>
      );
    }

    const hideStars = this.hasMaxReminders();

    return (
      <FlatList
        ref={(c) => this.list = c}
        style={[
          styles.list,
          { paddingBottom: hasMoreSteps ? 40 : undefined },
        ]}
        data={steps}
        extraData={{ hideStars }}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <RowSwipeable
            bump={showStepBump && index === 0}
            onBumpComplete={showStepBump && index === 0 ? this.completeStepBump : undefined}
            key={item.id}
            onDelete={() => this.handleDeleteReminder(item)}
            onComplete={() => this.handleCompleteReminder(item)}
          >
            <StepItem
              step={item}
              type="swipeable"
              hideAction={hideStars}
              onSelect={this.handleRowSelect}
              onAction={this.handleSetReminder} />
          </RowSwipeable>
        )}
        removeClippedSubviews={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        ListFooterComponent={this.state.paging ? <FooterLoading /> : null}
      />
    );
  }


  renderSteps() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderFocusPrompt()}
        <ScrollView
          style={[ styles.container, this.handleBackgroundColor() ]}
          refreshControl={<RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.contentContainer,
            {
              // Flex the white background to the bottom when there's only a few steps
              // Don't do it all the time because it causes the top to be static
              flex: this.props.steps.length < 5 ? 1 : undefined,
            },
          ]}
        >
          {this.renderReminders()}
          {this.renderList()}
        </ScrollView>
      </View>
    );
  }

  render() {
    const { t, dispatch, steps } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => dispatch(openMainMenu())} />
          }
          title={t('title').toUpperCase()}
        />
        {steps ? this.renderSteps() : <LoadingGuy />}
      </View>
    );
  }
}

export const mapStateToProps = ({ steps, people, notifications, swipe }) => ({
  steps: steps.mine && nonReminderStepsSelector({ steps, people }),
  reminders: reminderStepsSelector({ steps, people }),
  areNotificationsOff: !notifications.hasAsked && !notifications.shouldAsk && !notifications.token,
  showNotificationReminder: notifications.showReminder,
  showStepBump: swipe.stepsHome,
  showStepReminderBump: swipe.stepsReminder,
  hasMoreSteps: steps.pagination.hasNextPage,
  pushtoken: notifications.token,
});

export default connect(mapStateToProps)(StepsScreen);
