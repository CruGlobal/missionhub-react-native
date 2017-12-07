import React, { Component } from 'react';
import { Animated, PanResponder } from 'react-native';
import PropTypes from 'prop-types';

import StepItem from '../StepItem';
import { Touchable } from '../common';
import theme from '../../theme';

export default class StepItemDraggable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      longPress: false,
      isMoving: false,
      pan: new Animated.ValueXY(),
    };

    this.snapBack = this.snapBack.bind(this);
  }

  componentWillMount() {
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
      onPanResponderMove: Animated.event([null, { dx: 0, dy: this.state.pan.y }]),
      onPanResponderTerminationRequest: () => false,
      onPanResponderReject: (...args) => this.snapBack(...args),
      onPanResponderRelease: (...args) => this.snapBack(...args),
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

  toggleMove(isMoving) {
    this.setState({ isMoving });
    this.props.onToggleMove(isMoving);
  }

  isDropArea(gesture) {
    // Calculate the target drop area based on all these factors
    return gesture.moveY - theme.headerHeight <= this.props.dropZoneHeight;
  }

  renderRow() {
    const { onSelect, step, isOffScreen, isMe } = this.props;
    const { longPress } = this.state;

    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    let style = [
      panStyle,
      { zIndex: longPress ? 1 : undefined },
    ];
    let itemType = 'draggable';
    if (longPress) {
      itemType = 'dragging';
    } else if (isOffScreen) {
      itemType = 'offscreen';
    }
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={style}
      >
        <Touchable
          onPress={() => onSelect(step)}
          onLongPress={() => this.setState({ longPress: true })}>
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
