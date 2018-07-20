import React, { Component } from 'react';
import { View, Animated, PanResponder, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { Flex, Touchable, Icon, Text } from '../common';

import styles from './styles';

const OPTION_WIDTH = 75;
// Distance the gesture must travel before initiating the swipe action
const OPEN_MOVE_THRESHOLD = 15;

@translate()
class RowSwipeable extends Component {
  constructor(props) {
    super(props);

    let numOptions = 0;
    if (props.onDelete) {
      numOptions++;
    }
    if (props.onComplete) {
      numOptions++;
    }
    if (props.onEdit) {
      numOptions++;
    }

    this.numOptions = numOptions;
    this.openDistance = numOptions * -1 * OPTION_WIDTH;

    this.translateX = new Animated.Value(0);
    this.isScrollingRight = false;
    this.initialTranslateXValue = null;
    this.isOpen = false;

    this.snapBack = this.snapBack.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (...args) =>
        this.checkShouldMove(...args),
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

    this.openListener = DeviceEventEmitter.addListener(
      'RowSwipeable_open',
      emitter => {
        // If the event is being called within this component, do nothing
        if (emitter === this) {
          return;
        }
        // Close all other swipeable rows when another one it opened
        this.close();
      },
    );
  }

  componentDidMount() {
    if (this.props.bump) {
      Animated.timing(this.translateX, {
        duration: 700,
        toValue:
          ((this.numOptions - 1) * OPTION_WIDTH + OPTION_WIDTH * 0.5) * -1,
        delay: 1000,
      }).start(() => {
        Animated.timing(this.translateX, {
          duration: 700,
          toValue: 0,
          delay: 1800,
        }).start(() => {
          if (this.props.onBumpComplete) {
            this.props.onBumpComplete();
          }
        });
      });
    }
  }

  componentWillUnmount() {
    this.openListener.remove();
  }

  checkShouldMove(e, { dx }) {
    if (!this.isOpen) {
      return dx < -1 * OPEN_MOVE_THRESHOLD;
    }
    return Math.abs(dx) > OPEN_MOVE_THRESHOLD;
  }

  snapBack(e, gesture) {
    if (
      !this.isScrollingRight &&
      (gesture.dx <= this.openDistance || (this.isOpen && gesture.dx < 0))
    ) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.initialTranslateXValue = null;
    this.isOpen = true;
    this.move(this.openDistance);
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

  handleSelect(callback) {
    return () => {
      this.close();
      callback();
    };
  }

  renderOptions() {
    const { t, onDelete, onComplete, onEdit } = this.props;
    return (
      <Flex
        direction="row"
        justify="end"
        style={[styles.optionsWrap, { width: this.numOptions * OPTION_WIDTH }]}
      >
        {onDelete ? (
          <Touchable
            style={styles.deleteWrap}
            onPress={this.handleSelect(onDelete)}
          >
            <Flex direction="column" align="center" justify="center">
              <Icon name="deleteIcon" type="MissionHub" size={26} />
              <Text style={styles.text}>{t('swipe.remove')}</Text>
            </Flex>
          </Touchable>
        ) : null}
        {onComplete ? (
          <Touchable
            style={styles.completeWrap}
            onPress={this.handleSelect(onComplete)}
          >
            <Flex direction="column" align="center" justify="center">
              <Icon name="checkIcon" type="MissionHub" size={26} />
              <Text style={styles.text}>{t('swipe.complete')}</Text>
            </Flex>
          </Touchable>
        ) : null}
        {onEdit ? (
          <Touchable
            style={styles.editWrap}
            onPress={this.handleSelect(onEdit)}
          >
            <Flex direction="column" align="center" justify="center">
              <Icon name="createStepIcon" type="MissionHub" size={30} />
              <Text style={styles.text}>{t('swipe.edit')}</Text>
            </Flex>
          </Touchable>
        ) : null}
      </Flex>
    );
  }

  render() {
    const { children } = this.props;

    const panStyle = {
      transform: [{ translateX: this.translateX }],
    };
    return (
      <View>
        {this.renderOptions()}
        <Animated.View {...this.panResponder.panHandlers} style={panStyle}>
          {children}
        </Animated.View>
      </View>
    );
  }
}

RowSwipeable.propTypes = {
  children: PropTypes.element.isRequired,
  onComplete: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  bump: PropTypes.bool,
  onBumpComplete: PropTypes.func,
};

export default RowSwipeable;
