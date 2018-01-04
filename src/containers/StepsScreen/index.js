import React, { Component } from 'react';
import { View, FlatList, ListView } from 'react-native';
import { connect } from 'react-redux';

import { navigatePush } from '../../actions/navigation';
import { setupPushNotifications, noNotificationReminder } from '../../actions/notifications';
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

class StepsScreen extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 || (r1.id === 'empty' && r2.id === 'empty') });
    this.state = {
      ds: ds.cloneWithRows([{ id: 'empty' }].concat(props.steps)),
      // ds: ds.cloneWithRows(props.steps),
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
    this.props.dispatch(setupPushNotifications());
    this.props.dispatch(getMySteps());
  }

  componentWillReceiveProps(nextProps) {
    // Only use the dataSource for the ListView on Android
    if (isAndroid && nextProps.steps.length !== this.props.steps.length) {
      WARN('updating rows');
      this.setState({ ds: this.state.ds.cloneWithRows([{ id: 'empty' }].concat(nextProps.steps)) });
      // this.setState({ ds: this.state.ds.cloneWithRows(nextProps.steps) });
    }
  }

  componentDidMount() {
    this.setTopHeight();
  }

  componentWillUpdate(nextProps, nextState) {
    // if (nextState.moving && !this.state.moving) {
    //   this.setState({ ds: this.state.ds.cloneWithRows([{ id: 'empty' }].concat(nextProps.steps)) });
    // } else if (!nextState.moving && this.state.moving) {
    //   this.setState({ ds: this.state.ds.cloneWithRows(this.props.steps) });
    // }
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

  handleToggleMove(bool) {
    this.setState({ moving: bool }, this.setTopHeight);
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
    const { reminders, myId } = this.props;
    const { moving, topHeight } = this.state;
    let style = {
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
            This week
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
          <Icon name="add" size={36} />
          <Text type="header" style={styles.title}>
            Focus your week
          </Text>
          <Text style={styles.description}>
            Drag and drop up to 3 steps here and get friendly reminders.
          </Text>
        </Flex>
      </Flex>
    );
  }

  renderList() {
    const { steps, myId } = this.props;
    const { moving, topHeight, offTopItems } = this.state;
    if (isAndroid) {
      return (
        <ListView
          ref={(c) => this.list = c}
          style={[
            styles.list,
            {
              // paddingTop: !moving ? topHeight : 0,
              paddingTop: 0,
            },
          ]}
          dataSource={this.state.ds}
          renderRow={(item) => {
            if (item.id === 'empty') {
              return <View key="empty" style={{ flex: 1, height: topHeight }} />;
            }
            return (
              <StepItemDraggable
                onSelect={this.handleRowSelect}
                step={item}
                isMe={item.receiver ? item.receiver.id === myId : false}
                dropZoneHeight={topHeight}
                isOffScreen={undefined}
                onComplete={this.handleDropStep}
                onToggleMove={this.handleToggleMove}
              />
            );
          }
          }
          enableEmptySections={true}
          initialListSize={100}
          pageSize={100}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!moving}
          onScroll={this.handleScroll}
          scrollEventThrottle={100}
        />
      );
    }
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={[
          styles.list,
          { paddingTop: topHeight },
        ]}
        data={steps}
        contentInset={{ bottom: topHeight }}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <StepItemDraggable
            onSelect={this.handleRowSelect}
            step={item}
            isMe={item.receiver ? item.receiver.id === myId : false}
            dropZoneHeight={topHeight}
            isOffScreen={moving ? index < offTopItems : undefined}
            onComplete={this.handleDropStep}
            onToggleMove={this.handleToggleMove}
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
    return (
      <View style={{ flex: 1 }}>
        <Header
          left={
            <IconButton name="menuIcon" type="MissionHub" onPress={() => this.props.dispatch(navigatePush('DrawerOpen'))} />
          }
          right={
            this.props.isCasey ? null : (
              <IconButton name="searchIcon" type="MissionHub" onPress={()=> this.props.dispatch(navigatePush('SearchPeople'))} />
            )
          }
          title="STEPS OF FAITH"
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
