import React, { Component } from 'react';
import { View, Image, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { removeSwipeStepsHome, removeSwipeStepsReminder } from '../../actions/swipe';
import { loadHome } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';
import { showReminderScreen, toast } from '../../actions/notifications';
import { getMySteps, setStepReminder, removeStepReminder, completeStepReminder, deleteStep } from '../../actions/steps';

import styles from './styles';
import { Flex, Text, Icon, IconButton } from '../../components/common';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import Header from '../Header';
import NULL from '../../../assets/images/footprints.png';
import { CONTACT_SCREEN } from '../ContactScreen';
import { DRAWER_OPEN } from '../../constants';

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
    this.props.dispatch(navigatePush(CONTACT_SCREEN, { person: step.receiver }));
  }

  handleSetReminder(step) {
    if (this.props.reminders.length >= MAX_REMINDERS) {
      return;
    }

    this.props.dispatch(toast('✔ Reminder Added'));

    const showPushReminder = this.props.reminders.length === 0;
    this.props.dispatch(setStepReminder(step));
    if (showPushReminder) {
      this.props.dispatch(showReminderScreen());
    }
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

  renderTop() {
    const { reminders, t, showStepReminderBump } = this.props;


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
    if (!steps.length === 0) {
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
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={[
          styles.list,
        ]}
        data={steps}
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
    const { t, dispatch, isJean } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => dispatch(navigatePush(DRAWER_OPEN))} />
          }
          right={
            isJean ? (
              <IconButton name="searchIcon" type="MissionHub" onPress={()=> dispatch(navigatePush('SearchPeople'))} />
            ) : null
          }
          title={t('title').toUpperCase()}
        />
        <ScrollView style={styles.container}>
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
