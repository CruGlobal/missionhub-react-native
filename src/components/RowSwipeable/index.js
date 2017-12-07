import React, { Component } from 'react';
import { View, Animated, PanResponder, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Touchable, Icon } from '../common';
import styles from './styles';

const OPEN_DISTANCE = -150;
export default class RowSwipeable extends Component {

  constructor(props) {
    super(props);

    this.translateX = new Animated.Value(0);
    this.isScrollingRight = false;
    this.initialTranslateXValue = null;
    this.isOpen = false;

    this.snapBack = this.snapBack.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        // this.state.pan.setOffset({ x: this._val.x, y: 0 });
        // this.state.pan.setValue({ x: 0, y: 0 });
      },
      // onPanResponderMove: Animated.event([null, { dx: this.state.pan.x }]),
      onPanResponderMove: (e, gesture) => {
        const { dx } = gesture;
        if (this.initialTranslateXValue === null) {
          this.initialTranslateXValue = this.translateX._value;
        }
        const change = dx + this.initialTranslateXValue;
        this.translateX.setValue(change);
        this.isScrollingRight = dx > 0;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderReject: (...args) => this.snapBack(...args),
      onPanResponderRelease: (...args) => this.snapBack(...args),
    });

    this.openListener = DeviceEventEmitter.addListener('RowSwipeable_open', (emitter) => {
      // If the event is being called within this component, do nothing
      if (emitter === this) { return; }
      // Close all other swipeable rows when another one it opened
      this.close();
    });
  }

  componentWillUnmount() {
    this.openListener.remove();
  }

  snapBack(e, gesture) {
    if (!this.isScrollingRight && (gesture.dx <= OPEN_DISTANCE || (this.isOpen && gesture.dx < 0))) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.initialTranslateXValue = null;
    this.isOpen = true;
    this.move(OPEN_DISTANCE);
    DeviceEventEmitter.emit('RowSwipeable_open', this);
  }

  close() {
    this.isOpen = false;
    this.initialTranslateXValue = null;
    this.move(0);
  }

  move(toValue) {
    Animated.spring(this.translateX, { toValue, speed: 16 }).start();
  }

  render() {
    const { children } = this.props;

    const panStyle = {
      transform: [{ translateX: this.translateX }],
    };
    return (
      <View>
        <Flex direction="row" justify="end" style={styles.optionsWrap}>
          <Touchable style={styles.deleteWrap} onPress={this.props.onDelete}>
            <Icon name="deleteIcon" type="MissionHub" size={26} />
          </Touchable>
          <Touchable style={styles.completeWrap} onPress={this.props.onComplete}>
            <Icon name="checkIcon" type="MissionHub" size={26} />
          </Touchable>
        </Flex>
        <Animated.View {...this.panResponder.panHandlers} style={panStyle}>
          {children}
        </Animated.View>
      </View>
    );
  }
}

RowSwipeable.propTypes = {
  children: PropTypes.element.isRequired,
};
