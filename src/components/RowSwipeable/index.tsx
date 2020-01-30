import React, { Component } from 'react';
import { View, Animated, PanResponder, DeviceEventEmitter } from 'react-native';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { Flex, Touchable, Icon, Text } from '../common';

import styles from './styles';

const OPTION_WIDTH = 75;
// Distance the gesture must travel before initiating the swipe action
const OPEN_MOVE_THRESHOLD = 15;

// @ts-ignore
@withTranslation()
class RowSwipeable extends Component {
  // @ts-ignore
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

    // @ts-ignore
    this.numOptions = numOptions;
    // @ts-ignore
    this.openDistance = numOptions * -1 * OPTION_WIDTH;

    // @ts-ignore
    this.translateX = new Animated.Value(0);
    // @ts-ignore
    this.isScrollingRight = false;
    // @ts-ignore
    this.initialTranslateXValue = null;
    // @ts-ignore
    this.isOpen = false;

    this.snapBack = this.snapBack.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  UNSAFE_componentWillMount() {
    // @ts-ignore
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
        // @ts-ignore
        if (this.initialTranslateXValue === null) {
          // @ts-ignore
          this.initialTranslateXValue = this.translateX._value;
        }
        // @ts-ignore
        const change = dx + this.initialTranslateXValue;
        // @ts-ignore
        this.translateX.setValue(change);
        // @ts-ignore
        this.isScrollingRight = dx > 0;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderReject: (...args) => this.snapBack(...args),
      onPanResponderRelease: (...args) => this.snapBack(...args),
    });

    // @ts-ignore
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
    // @ts-ignore
    if (this.props.bump) {
      // @ts-ignore
      Animated.timing(this.translateX, {
        duration: 700,
        toValue:
          // @ts-ignore
          ((this.numOptions - 1) * OPTION_WIDTH + OPTION_WIDTH * 0.5) * -1,
        delay: 1000,
      }).start(() => {
        // @ts-ignore
        Animated.timing(this.translateX, {
          duration: 700,
          toValue: 0,
          delay: 1800,
        }).start(() => {
          // @ts-ignore
          if (this.props.onBumpComplete) {
            // @ts-ignore
            this.props.onBumpComplete();
          }
        });
      });
    }
  }

  componentWillUnmount() {
    // @ts-ignore
    this.openListener.remove();
  }

  // @ts-ignore
  checkShouldMove(e, { dx }) {
    // @ts-ignore
    if (!this.isOpen) {
      return dx < -1 * OPEN_MOVE_THRESHOLD;
    }
    return Math.abs(dx) > OPEN_MOVE_THRESHOLD;
  }

  // @ts-ignore
  snapBack(e, gesture) {
    if (
      // @ts-ignore
      !this.isScrollingRight &&
      // @ts-ignore
      (gesture.dx <= this.openDistance || (this.isOpen && gesture.dx < 0))
    ) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    // @ts-ignore
    this.initialTranslateXValue = null;
    // @ts-ignore
    this.isOpen = true;
    // @ts-ignore
    this.move(this.openDistance);
    DeviceEventEmitter.emit('RowSwipeable_open', this);
  }

  close() {
    // @ts-ignore
    this.isOpen = false;
    // @ts-ignore
    this.initialTranslateXValue = null;
    this.move(0);
  }

  // @ts-ignore
  move(toValue) {
    // @ts-ignore
    Animated.spring(this.translateX, { toValue, speed: 16 }).start();
  }

  // @ts-ignore
  handleSelect(callback) {
    return () => {
      this.close();
      callback();
    };
  }

  handleDelete = () => {
    // @ts-ignore
    const { deletePressProps, onDelete } = this.props;
    if (onDelete) {
      // Call the onDelete with all of the deletePressProps passed in or just undefined if they don't exist
      onDelete(...deletePressProps);
    }
  };

  handleComplete = () => {
    // @ts-ignore
    const { completePressProps, onComplete } = this.props;
    if (onComplete) {
      // Call the onComplete with all of the completePressProps passed in or just undefined if they don't exist
      onComplete(...completePressProps);
    }
  };

  handleEdit = () => {
    // @ts-ignore
    const { editPressProps, onEdit } = this.props;
    if (onEdit) {
      // Call the onEdit with all of the editPressProps passed in or just undefined if they don't exist
      onEdit(...editPressProps);
    }
  };

  renderOptions() {
    // @ts-ignore
    const { t, onDelete, onComplete, onEdit } = this.props;
    return (
      <Flex
        direction="row"
        justify="end"
        // @ts-ignore
        style={[styles.optionsWrap, { width: this.numOptions * OPTION_WIDTH }]}
      >
        {onDelete ? (
          <Touchable
            style={styles.deleteWrap}
            onPress={this.handleSelect(this.handleDelete)}
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
            onPress={this.handleSelect(this.handleComplete)}
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
            onPress={this.handleSelect(this.handleEdit)}
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
      // @ts-ignore
      transform: [{ translateX: this.translateX }],
    };
    return (
      <View>
        {this.renderOptions()}
        {/* 
        // @ts-ignore */}
        <Animated.View {...this.panResponder.panHandlers} style={panStyle}>
          {children}
        </Animated.View>
      </View>
    );
  }
}

// @ts-ignore
RowSwipeable.propTypes = {
  children: PropTypes.element.isRequired,
  onComplete: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  bump: PropTypes.bool,
  onBumpComplete: PropTypes.func,
  deletePressProps: PropTypes.array,
  completePressProps: PropTypes.array,
  editPressProps: PropTypes.array,
};

export default RowSwipeable;
