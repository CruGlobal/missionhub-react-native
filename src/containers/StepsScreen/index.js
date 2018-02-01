import React, { Component } from 'react';
import { View, Image, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { removeSwipeStepsHome, removeSwipeStepsReminder } from '../../actions/swipe';
import { loadHome } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';
import { setupPushNotifications, noNotificationReminder, toast } from '../../actions/notifications';
import { getMySteps, setStepReminder, removeStepReminder, completeStepReminder, deleteStep } from '../../actions/steps';

import styles from './styles';
import { Flex, Text, Icon, IconButton } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import Header from '../Header';
import NULL from '../../../assets/images/footprints.png';

const MAX_REMINDERS = 3;

@translate('stepsTab')
class StepsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addedReminder: props.reminders.length > 0,
    };

    this.completeStepBump = this.completeStepBump.bind(this);
    this.completeReminderBump = this.completeReminderBump.bind(this);
    this.handleSetReminder = this.handleSetReminder.bind(this);
    this.handleRemoveReminder = this.handleRemoveReminder.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadHome());
    this.props.dispatch(getMySteps());
  }

  completeStepBump() {
    this.props.dispatch(removeSwipeStepsHome());
  }

  completeReminderBump() {
    this.props.dispatch(removeSwipeStepsReminder());
  }

  handleRowSelect(step) {
    this.props.dispatch(navigatePush('Contact', { person: step.receiver }));
  }

  handleSetReminder(step) {
    if (this.props.reminders.length >= MAX_REMINDERS) {
      return;
    }

    this.props.dispatch(toast('✔ Reminder Added'));

    this.props.dispatch(setStepReminder(step));
    this.reminderAdded();
  }

  handleRemoveReminder(step) {
    this.props.dispatch(removeStepReminder(step));
  }

  handleCompleteReminder(step) {
    this.props.dispatch(completeStepReminder(step));
  }

  handleDeleteReminder(step) {
    this.props.dispatch(deleteStep(step));
  }

  reminderAdded() {
    if (!this.state.addedReminder) {
      this.setState({ addedReminder: true });
      if (this.props.areNotificationsOff && this.props.showNotificationReminder) {
        this.props.dispatch(navigatePush('NotificationOff', {
          onClose: (shouldAsk) => {
            if (shouldAsk) {
              this.props.dispatch(setupPushNotifications());
            } else {
              this.props.dispatch(noNotificationReminder());
            }
          },
        }));
      }
    }
  }

  renderTop() {
    const { reminders, steps, t, showStepReminderBump } = this.props;

    if (reminders.length === 0 && steps.length === 0) return null;
    // if (true) return null;

    if (reminders.length > 0) {
      return (
        <Flex align="center" style={[ styles.top, styles.topItems ]}
        >
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

  renderList() {
    const { steps, reminders, t, showStepBump } = this.props;
    if (steps.length === 0) {
      const hasReminders = reminders.length > 0;
      return (
        <Flex align="center" justify="center" style={{ paddingTop: 50 }}>
          <Image source={NULL} />
          <Text type="header" style={styles.nullHeader}>
            {t('nullHeader')}
          </Text>
          <Text style={styles.nullText}>
            {
              hasReminders ? t('nullWithReminders') : t('nullNoReminders')
            }
          </Text>
        </Flex>
      );
    }
    
    const hideStars = reminders.length === MAX_REMINDERS;

    return (
      <FlatList
        ref={(c) => this.list = c}
        style={[
          styles.list,
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
        removeClippedSubviews={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }

  render() {
    const { steps, t, dispatch, isJean } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => dispatch(navigatePush('DrawerOpen'))} />
          }
          right={
            isJean ? (
              <IconButton name="searchIcon" type="MissionHub" onPress={()=> dispatch(navigatePush('SearchPeople'))} />
            ) : null
          }
          title={t('title').toUpperCase()}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.contentContainer,
            {
              // Flex the white background to the bottom when there's only a few steps
              // Don't do it all the time because it causes the top to be static
              flex: steps.length < 5 ? 1 : undefined,
            } ]}>
          {this.renderTop()}
          {this.renderList()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, steps, notifications, swipe }) => ({
  isJean: auth.isJean,
  steps: steps.mine.filter((s)=> !s.reminder),
  reminders: steps.reminders,
  areNotificationsOff: !notifications.hasAsked && !notifications.shouldAsk && !notifications.token,
  showNotificationReminder: notifications.showReminder,
  showStepBump: swipe.stepsHome,
  showStepReminderBump: swipe.stepsReminder,
});

export default connect(mapStateToProps)(StepsScreen);
