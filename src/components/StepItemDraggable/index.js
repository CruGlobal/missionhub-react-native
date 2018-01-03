import React, { Component } from 'react';
import { Animated, PanResponder } from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import StepItem from '../StepItem';
import { Touchable } from '../common';
import { isAndroid } from '../../utils/common';
import theme from '../../theme';

export default class StepItemDraggable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      longPress: false,
      isMoving: false,
      pan: new Animated.ValueXY(),
    };

    this.toggleMove = debounce(this.toggleMove.bind(this), 500);
    this.snapBack = this.snapBack.bind(this);
    this.stopMove = this.stopMove.bind(this);
    this.handleLongPress = this.handleLongPress.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener((value) => this._val = value);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => this.state.longPress,
      onMoveShouldSetPanResponderCapture: () => this.state.longPress,
      onPanResponderGrant: () => {
        // if (this.state.longPress) {
        //   this.state.pan.setOffset({ x: 0, y: this._val.y });
        //   this.state.pan.setValue({ x: 0, y: 0 });
        // }
        this.state.pan.setOffset({ x: 0, y: this._val.y });
        this.state.pan.setValue({ x: 0, y: 0 });
        this.toggleMove(true);
      },
      onPanResponderMove: (...args) => {
        if (!this.state.longPress) {
          return Animated.event([null, { dx: 0, dy: 0 }])(...args);
        }
        return Animated.event([null, { dx: 0, dy: this.state.pan.y }])(...args);
      },
      // onPanResponderMove: Animated.event([null, { dx: 0, dy: this.state.pan.y }]),
      onPanResponderTerminationRequest: () => true,
      onPanResponderReject: (...args) => this.snapBack(...args),
      onPanResponderRelease: (...args) => this.snapBack(...args),
      onPanResponderTerminate: (...args) => this.snapBack(...args),
      onShouldBlockNativeResponder: () => false,
    });
  }

  snapBack(e, gesture) {
    this.toggleMove(false);
    this.setState({ longPress: false });

    // Check if it's within the target drop area
    if (this.isDropArea(gesture)) {
      Animated.timing(this.state.pan, {
        toValue: { x: 0, y: 0 },
        duration: 10,
      }).start(() => {
        this.props.onComplete(this.props.step);
      });
    } else {
      Animated.spring(this.state.pan, {
        toValue: { x: 0, y: 0 },
        speed: 16,
      }).start();
    }
  }

  stopMove() {
    this.setState({ isMoving: false, longPress: false });
    this.props.onToggleMove(false);
  }

  toggleMove(isMoving) {
    this.setState({ isMoving, longPress: isMoving });
    this.props.onToggleMove(isMoving);
  }

  isDropArea(gesture) {
    // Calculate the target drop area based on all these factors
    return gesture.moveY - theme.headerHeight <= this.props.dropZoneHeight;
  }

  handleLongPress() {
    WARN('longpress');
    this.setState({ longPress: true });
  }

  handleSelect() {
    this.props.onSelect(this.props.step);
  }

  renderRow() {
    const { step, isOffScreen, isMe } = this.props;
    const { longPress } = this.state;

    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    let style = [
      panStyle,
      { zIndex: longPress ? 10 : undefined },
      // longPress ? {
      //   position: 'absolute',
      //   top: this._val.y,
      //   left: 0,
      //   right: 0,
      // } : {},
    ];
    let itemType = 'draggable';
    if (longPress) {
      itemType = 'dragging';
    } else if (isOffScreen) {
      itemType = 'offscreen';
    }
    // itemType = 'dragging';
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={style}
      >
        <Touchable
          onPress={this.handleSelect}
          delayLongPress={isAndroid ? 1400 : undefined}
          onPressOut={this.stopMove}
          onLongPress={this.handleLongPress}>
          <StepItem step={step} type={itemType} isMe={isMe} />
        </Touchable>
      </Animated.View>
    );
  }

  render() {
    // if (this.state.isMoving) {
    //   return (
    //     <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'orange', zIndex: 500 }}>
    //       {this.renderRow()}
    //     </View>
    //   );
    // }
    return this.renderRow();
  }
}

StepItemDraggable.propTypes = {
  step: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  dropZoneHeight: PropTypes.number.isRequired,
  isOffScreen: PropTypes.bool,
};
