import React, { Component } from 'react';
import { View, FlatList, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { loadHome } from '../../actions/auth';
import { navigatePush } from '../../actions/navigation';
import { noNotificationReminder, setupPushNotifications } from '../../actions/notifications';
import { getMySteps, setStepReminder, removeStepReminder, completeStepReminder } from '../../actions/steps';

import styles from './styles';
import { Flex, Text, Icon, IconButton } from '../../components/common';
import StepItemDraggable from '../../components/StepItemDraggable';
import StepItem from '../../components/StepItem';
import RowSwipeable from '../../components/RowSwipeable';
import { isAndroid } from '../../utils/common';
import Header from '../Header';
import theme from '../../theme';

const MAX_REMINDERS = 3;
const DROPZONE_HEIGHT = 85;
const ROW_HEIGHT = theme.itemHeight + 0.2;

@translate('stepsTab')
class StepsScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      moving: false,
      topHeight: 0,
      offTopItems: 0,
      addedReminder: props.reminders.length > 0,
    };

    this.handleToggleMove = this.handleToggleMove.bind(this);
    this.handleDropStep = this.handleDropStep.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.setTopHeight = this.setTopHeight.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(loadHome());
    this.props.dispatch(getMySteps());
  }

  componentDidMount() {
    this.setTopHeight();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.reminders.length !== this.props.reminders.length) {
      this.setTopHeight();
    }
  }

  setTopHeight() {
    let height = 0;
    const remindersLength = this.props.reminders.length;
    if (remindersLength) {
      height += 55;
      if (remindersLength < MAX_REMINDERS) {
        height += DROPZONE_HEIGHT;
      }
    } else {
      height += 250;
    }
    height += remindersLength * ROW_HEIGHT;
    this.setState({ topHeight: height });
  }

  handleToggleMove(step, isMoving) {
    if (isAndroid) {
      if (isMoving) {
        this.handleDropStep(step);
      }
      return;
    }
    this.setState({ moving: isMoving }, this.setTopHeight);
  }

  handleRowSelect(step) {
    this.props.dispatch(navigatePush('Contact', { person: step.receiver }));
  }

  handleDropStep(step) {
    this.setState({ moving: false });
    const doesExist = !!this.props.reminders.find((s) => s.id === step.id);
    if (doesExist) {
      return;
    }
    if (this.props.reminders.length >= MAX_REMINDERS) {
      return;
    }
    
    if (isAndroid) {
      ToastAndroid.show('✔ Reminder Added', ToastAndroid.SHORT);
    }
    
    this.props.dispatch(setStepReminder(step));
    this.reminderAdded();
  }

  handleCompleteReminder(step) {
    this.props.dispatch(completeStepReminder(step));
  }

  handleRemoveReminder(step) {
    this.props.dispatch(removeStepReminder(step));
  }

  handleScroll(e) {
    if (this.state.moving) return;
    const offsetY = e.nativeEvent.contentOffset.y;
    const offTopItems = Math.round(((offsetY + 20) / ROW_HEIGHT));
    this.setState({ offTopItems });
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
    const { reminders, myId, t } = this.props;
    const { moving, topHeight } = this.state;
    let style = {
      // height: isAndroid ? undefined : topHeight,
      height: topHeight,
    };
    if (!moving) {
      // Add zIndex while normal scrolling, but remove it when moving an item
      style.zIndex = 1;
    }
    if (reminders.length > 0) {
      return (
        <Flex align="center" style={[styles.top, styles.topItems, style]}
        >
          <Text style={styles.topTitle}>
            {t('reminderTitle').toUpperCase()}
          </Text>
          {
            reminders.map((s) => (
              <RowSwipeable
                key={s.id}
                onDelete={() => this.handleRemoveReminder(s)}
                onComplete={() => this.handleCompleteReminder(s)}
              >
                <StepItem step={s} type="swipeable" isMe={s.receiver ? s.receiver.id === myId : false} />
              </RowSwipeable>
            ))
          }
          {
            reminders.length < MAX_REMINDERS ? (
              <Flex
                align="center"
                justify="end"
                style={[styles.dropZone, { height: DROPZONE_HEIGHT }]}>
                <Flex align="center" justify="center" self="stretch" style={styles.dropZoneBorder}>
                  <Icon name="plusIcon" type="MissionHub" size={20} color="white" />
                </Flex>
              </Flex>
            ) : null
          }
        </Flex>
      );
    }
    return (
      <Flex align="center" justify="center" style={[styles.top, styles.topEmpty, style]}>
        <Flex align="center" justify="center" value={1} style={styles.topBorder}>
          <Icon name="bellIcon" type="MissionHub" size={36} />
          <Text type="header" style={styles.title}>
            {t('dragTitle').toUpperCase()}
          </Text>
          <Text style={styles.description}>
            {
              isAndroid ? t('holdDescription') : t('dragDescription')
            }
          </Text>
        </Flex>
      </Flex>
    );
  }

  renderList() {
    const { steps, myId } = this.props;
    const { moving, topHeight, offTopItems } = this.state;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={[
          styles.list,
          { paddingTop: isAndroid ? 0 : topHeight },
        ]}
        data={steps}
        contentInset={{ bottom: isAndroid ? 0 : topHeight }}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <StepItemDraggable
            onSelect={this.handleRowSelect}
            step={item}
            isMe={item.receiver ? item.receiver.id === myId : false}
            dropZoneHeight={topHeight}
            isOffScreen={moving ? index < offTopItems : undefined}
            onComplete={this.handleDropStep}
            onToggleMove={(bool) => this.handleToggleMove(item, bool)}
          />
        )}
        removeClippedSubviews={true}
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!moving}
        onScroll={this.handleScroll}
        scrollEventThrottle={100}
      />
    );
  }

  render() {
    const { t, dispatch, isCasey } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => dispatch(navigatePush('DrawerOpen'))} />
          }
          right={
            isCasey ? null : (
              <IconButton name="searchIcon" type="MissionHub" onPress={()=> dispatch(navigatePush('SearchPeople'))} />
            )
          }
          title={t('title').toUpperCase()}
        />
        <Flex align="center" justify="center" value={1} style={styles.container}>
          {this.renderTop()}
          {this.renderList()}
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = ({ auth, steps, notifications }) => ({
  isCasey: !auth.hasMinistries,
  myId: auth.personId,
  steps: steps.mine.filter((s)=> !s.reminder),
  reminders: steps.reminders,
  areNotificationsOff: !notifications.hasAsked && !notifications.shouldAsk && !notifications.token,
  showNotificationReminder: notifications.showReminder,
});

export default connect(mapStateToProps)(StepsScreen);
