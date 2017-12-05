import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { getMySteps, setStepReminder, removeStepReminder } from '../../actions/steps';

import styles from './styles';
import { Flex, Text, Icon, IconButton, Touchable } from '../../components/common';
import StepItemDraggable from '../../components/StepItemDraggable';
import StepItem from '../../components/StepItem';
import Header from '../Header';

const isCasey = true;

const MAX_REMINDERS = 3;
const DROPZONE_HEIGHT = 85;
const ROW_HEIGHT = 90 + 0.2;

class StepsScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      moving: false,
      topHeight: 0,
      offTopItems: 0,
    };

    this.handleDropStep = this.handleDropStep.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.setTopHeight = this.setTopHeight.bind(this);
  }

  componentWillMount() {
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
      if (this.state.moving && remindersLength < MAX_REMINDERS) {
        height += DROPZONE_HEIGHT;
      }
    } else {
      height += 250;
    }
    height += remindersLength * ROW_HEIGHT;
    this.setState({ topHeight: height });
  }
  

  handleRowSelect(step) {
    LOG('TODO: Go To People, step selected', step);
  }

  handleDropStep(step) {
    const doesExist = !!this.props.reminders.find((s) => s.id === step.id);
    if (doesExist) {
      return;
    }
    if (this.props.reminders.length >= MAX_REMINDERS) {
      return;
    }
    this.props.dispatch(setStepReminder(step));
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

  renderTop() {
    const { reminders } = this.props;
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
              <Touchable key={s.id} onPress={() => this.handleRemoveReminder(s)}>
                <StepItem key={s.id} step={s} type="swipeable" />
              </Touchable>
            ))
          }
          {
            moving && reminders.length < MAX_REMINDERS ? (
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
    const { mine } = this.props;
    const { moving, topHeight, offTopItems } = this.state;
    return (
      <FlatList
        ref={(c) => this.list = c}
        style={[
          styles.list,
          { paddingTop: topHeight },
        ]}
        contentInset={{ bottom: topHeight }}
        data={mine}
        keyExtractor={(i) => i.id}
        renderItem={({ item, index }) => (
          <StepItemDraggable
            onSelect={this.handleRowSelect}
            step={item}
            dropZoneHeight={topHeight}
            isOffScreen={moving ? index < offTopItems : undefined}
            onComplete={this.handleDropStep}
            onToggleMove={(isMoving) => {
              this.setState({ moving: isMoving }, this.setTopHeight);
            }}
          />
        )}
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
            <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
          }
          right={
            isCasey ? null : (
              <IconButton name="stepsIcon" type="MissionHub" onPress={()=> LOG('pressed')} />
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

const mapStateToProps = ({ steps }) => ({
  mine: steps.mine,
  reminders: steps.reminders,
});

export default connect(mapStateToProps)(StepsScreen);
