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
      pan: new Animated.ValueXY(),
    };

    this.toggleMove = debounce(this.toggleMove.bind(this), 500);
    this.snapBack = this.snapBack.bind(this);
    this.handleLongPress = this.handleLongPress.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    if (!isAndroid) {
      this._val = { x: 0, y: 0 };
      this.state.pan.addListener((value) => this._val = value);
      this.panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => this.state.longPress,
        onPanResponderGrant: () => {
          this.state.pan.setOffset({ x: 0, y: this._val.y });
          this.state.pan.setValue({ x: 0, y: 0 });
          this.toggleMove(true);
        },
        onPanResponderMove: Animated.event([ null, { dx: 0, dy: this.state.pan.y } ]),
        onPanResponderTerminationRequest: () => true,
        onPanResponderReject: (...args) => this.snapBack(...args),
        onPanResponderRelease: (...args) => this.snapBack(...args),
      });
    }
  }

  snapBack(e, gesture) {
    this.toggleMove(false);

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

  toggleMove(isMoving) {
    this.setState({ longPress: isMoving });
    this.props.onToggleMove(isMoving);
  }

  isDropArea(gesture) {
    // Calculate the target drop area based on all these factors
    return gesture.moveY - theme.headerHeight <= this.props.dropZoneHeight;
  }

  handleLongPress() {
    this.toggleMove(true);
  }

  handleSelect() {
    this.props.onSelect(this.props.step);
  }

  render() {
    const { step, isOffScreen, isMe } = this.props;
    const { longPress } = this.state;

    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    let style = [
      panStyle,
      { zIndex: longPress ? 10 : undefined },
    ];
    let itemType = 'draggable';
    if (longPress) {
      itemType = 'dragging';
    } else if (isOffScreen) {
      itemType = 'offscreen';
    }
    return (
      <Animated.View
        {...(this.panResponder ? this.panResponder.panHandlers : {})}
        style={style}
      >
        <Touchable
          onPress={this.handleSelect}
          style={{}}
          onLongPress={this.handleLongPress}>
          <StepItem step={step} type={itemType} isMe={isMe} />
        </Touchable>
      </Animated.View>
    );
  }
}

StepItemDraggable.propTypes = {
  step: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  dropZoneHeight: PropTypes.number.isRequired,
  isOffScreen: PropTypes.bool,
};
