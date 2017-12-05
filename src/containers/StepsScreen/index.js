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
      scrollOffsetY: 0,
      offTopItems: 0,
    };

    this.handleDropStep = this.handleDropStep.bind(this);
    this.topLayout = this.topLayout.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getMySteps());
  }

  handleRowSelect(step) {
    LOG('step selected', step);
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

  topLayout(e) {
    const remindersLength = this.props.reminders.length;
    const extraPadding = remindersLength > 0 && remindersLength < MAX_REMINDERS ? DROPZONE_HEIGHT : 0;
    this.setState({ topHeight: e.nativeEvent.layout.height + extraPadding });
  }

  handleScroll(e) {
    if (this.state.moving) return;
    const offsetY = e.nativeEvent.contentOffset.y;
    const remindersLength = this.props.reminders.length;
    const extraPadding = remindersLength > 0 && remindersLength < MAX_REMINDERS ? DROPZONE_HEIGHT : 0;
    let offTopItems = Math.round(((offsetY + 20) / ROW_HEIGHT));
    if (extraPadding && offTopItems > 3) {
      offTopItems++;
    }
    this.setState({
      scrollOffsetY: offsetY,
      offTopItems,
    });
  }

  renderTop() {
    const { reminders } = this.props;
    const { moving } = this.state;
    let movingStyle = {};
    if (moving) {
      movingStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: this.state.topHeight,
      };
    }
    if (reminders.length > 0) {
      return (
        <Flex
          align="center"
          justify="start"
          onLayout={moving ? undefined : this.topLayout}
          removeClippedSubviews={true}
          style={[styles.topItems, movingStyle]}
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
      <Flex
        value={1}
        align="center"
        justify="center"
        onLayout={moving ? undefined : this.topLayout}
        style={[styles.top, movingStyle]}>
        <Flex
          align="center"
          justify="center"
          value={1}
          style={styles.topBorder}>
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

  render() {
    const { mine } = this.props;
    const { moving, scrollOffsetY, topHeight, offTopItems } = this.state;
    
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
          <FlatList
            ref={(c) => this.list = c}
            style={[
              styles.list,
              moving ? {
                paddingTop: scrollOffsetY <= topHeight ? topHeight : 0,
              } : null,
            ]}
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
                  this.setState({ moving: isMoving }, () => {
                    if (isMoving) {
                      // LOG('topHeight, scrollOffsetY, offTopItems', topHeight, scrollOffsetY, offTopItems);
                      if (scrollOffsetY >= topHeight) {
                        this.list.scrollToOffset({ offset: topHeight / 3, animated: false });
                      }
                    } else {
                      this.list.scrollToOffset({ offset: scrollOffsetY, animated: false });
                    }
                    
                  });
                }}
              />
            )}
            bounces={false}
            scrollEnabled={!moving}
            onScroll={this.handleScroll}
            scrollEventThrottle={100}
          />
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = ({ steps }) => ({
  mine: steps.mine,
  // mine: [].concat([steps.suggestedForMe[0], steps.suggestedForMe[1], steps.suggestedForMe[2]]).filter((s) => !!s),
  // mine: [
  //   { id: '1', body: 'hello 1' },
  //   { id: '2', body: 'hello 2' },
  //   { id: '3', body: 'hello 3' },
  //   { id: '4', body: 'hello 4' },
  //   { id: '5', body: 'hello 5' },
  //   { id: '6', body: 'hello 6' },
  //   { id: '7', body: 'hello 7' },
  //   { id: '8', body: 'hello 8' },
  //   { id: '9', body: 'hello 9' },
  // ],
  suggestedForOthers: steps.suggestedForOthers,
  reminders: steps.reminders,
});

export default connect(mapStateToProps)(StepsScreen);
