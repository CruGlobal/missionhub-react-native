/* eslint max-lines: 0 */

import React, { Component } from 'react';
import { View, Image, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import debounce from 'lodash/debounce';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { loadHome } from '../../actions/auth/userData';
import {
  showReminderScreen,
  showWelcomeNotification,
} from '../../actions/notifications';
import {
  getMySteps,
  setStepFocus,
  getMyStepsNextPage,
} from '../../actions/steps';
import { navigatePush } from '../../actions/navigation';
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
import { ACTIONS, STEPS_TAB } from '../../constants';
import TakeAStepWithSomeoneButton from '../TakeAStepWithSomeoneButton';
import { ACCEPTED_STEP_DETAIL_SCREEN } from '../AcceptedStepDetailScreen';
import TrackTabChange from '../TrackTabChange';

import styles from './styles';

const MAX_REMINDERS = 3;

function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
}

@translate('stepsTab')
export class StepsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      //addedReminder: props.reminders && props.reminders.length > 0,
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

  componentDidMount() {
    // For some reason, when the user logs out, this gets mounted again
    this.props.dispatch(loadHome());
  }

  getSteps() {
    return this.props.dispatch(getMySteps());
  }

  handleRowSelect(step) {
    this.props.dispatch(navigatePush(ACCEPTED_STEP_DETAIL_SCREEN, { step }));
  }

  hasReminders(reminders = []) {
    return reminders.length > 0;
  }

  hasMaxReminders() {
    return false;
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

    if (!this.hasReminders([])) {
      dispatch(showReminderScreen(t('notificationPrimer:focusDescription')));
    }
    dispatch(setStepFocus(step, true));

    dispatch(showWelcomeNotification());
  }

  handleRemoveReminder(step) {
    const { dispatch } = this.props;
    dispatch(trackActionWithoutData(ACTIONS.STEP_DEPRIORITIZED));
    dispatch(setStepFocus(step, false));
  }

  handleRefresh() {
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

  renderFocusPrompt() {
    const { t } = this.props;

    if (this.hasReminders([]) || this.hasFewSteps()) {
      return null;
    }

    return (
      <Flex
        align="center"
        justify="center"
        style={[styles.top, styles.topEmpty]}
      >
        <Icon name="starGroupIcon" type="MissionHub" size={45} />
        <Text type="header" style={styles.title}>
          {t('reminderTitle').toUpperCase()}
        </Text>
        <Text style={styles.description}>{t('reminderDescription')}</Text>
      </Flex>
    );
  }

  renderReminders(reminders) {
    const focusedSteps = reminders.filter(r => r && r.id);

    if (this.hasReminders(reminders)) {
      return (
        <Flex align="center" style={[styles.top]}>
          {focusedSteps.map(s => (
            <StepItem
              step={s}
              key={s.id}
              type="reminder"
              onSelect={this.handleRowSelect}
              onAction={this.handleRemoveReminder}
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
      />
    );
  };

  renderList(steps) {
    const { t, hasMoreSteps } = this.props;
    if (steps.length === 0) {
      return (
        <Flex value={1} align="center" justify="center">
          <Image source={NULL} />
          <Text type="header" style={styles.nullHeader}>
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

  renderSteps(steps) {
    const { reminders = [] } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {this.renderFocusPrompt()}
        <ScrollView
          style={[styles.container, this.handleBackgroundColor()]}
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
          {this.renderReminders([])}
          {this.renderList(steps)}
        </ScrollView>
        {steps.length > 0 || reminders.length > 0 ? null : (
          <TakeAStepWithSomeoneButton />
        )}
      </View>
    );
  }

  openMainMenu = () => this.props.dispatch(openMainMenu());

  render() {
    const { t, steps } = this.props;

    return (
      <View style={{ flex: 1 }}>
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
        <Query
          query={gql`
            {
              person(id: 1013) {
                id
                name
                acceptedChallenges {
                  id
                  title
                  accepted_at
                  receiver {
                    id
                    name
                    full_name
                  }
                  owner {
                    id
                    name
                    full_name
                  }
                }
              }
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return <Text>Loading...</Text>;
            }
            if (error) {
              console.log(error);
              return (
                <ScrollView>
                  <Text>{JSON.stringify(error)}</Text>
                </ScrollView>
              );
            }

            console.log(data);

            return this.renderSteps(data.person.acceptedChallenges);
          }}
        </Query>
      </View>
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
